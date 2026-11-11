import { prisma } from '../index.js';
import { createNotification } from './notificationController.js';

export const createBooking = async (req, res) => {
  try {
    const {
      vehicleId,
      startDate,
      endDate,
      pickupLocation,
      dropLocation,
      accessories,
    } = req.body;

    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
      include: { owner: { select: { id: true, firstName: true, lastName: true, email: true } } },
    });

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Owners cannot rent/book their own vehicle
    if (vehicle.ownerId === req.user.id) {
      return res.status(403).json({ message: 'You cannot book your own vehicle' });
    }

    // Calculate days and amounts
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    if (days <= 0) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return res.status(400).json({ message: 'Invalid booking dates' });
    }

    const overlappingBooking = await prisma.booking.findFirst({
      where: {
        vehicleId,
        status: { in: ['PENDING', 'APPROVED', 'ACTIVE'] },
        startDate: { lt: end },
        endDate: { gt: start },
      },
    });
    if (overlappingBooking) return res.status(409).json({ message: 'Vehicle is already booked for those dates' });

    const rentalCharges = vehicle.dailyPrice * days;
    const securityDeposit = vehicle.securityDeposit;
    
    // Parse accessories string to JSON
    let accessoriesData = {};
    let accessoriesCost = 0;
    if (accessories) {
      try {
        accessoriesData = typeof accessories === 'string' ? JSON.parse(accessories) : accessories;
        if (accessoriesData.gps) accessoriesCost += 15 * days;
        if (accessoriesData.childSeat) accessoriesCost += 10 * days;
      } catch (e) {
        console.error('Invalid accessories data');
      }
    }

    const totalAmount = rentalCharges + securityDeposit + accessoriesCost;

    // Create the booking with PENDING status (awaiting owner acceptance)
    const booking = await prisma.booking.create({
      data: {
        customerId: req.user.id,
        vehicleId,
        startDate: start,
        endDate: end,
        pickupLocation: pickupLocation || vehicle.location,
        dropLocation: dropLocation || vehicle.location,
        status: 'PENDING',
        totalAmount,
        securityDeposit,
        rentalCharges,
        accessories: JSON.stringify(accessoriesData),
        
        // Initial offline payment record
        payment: {
          create: {
            amount: totalAmount,
            status: 'PENDING',
            paymentMethod: 'OFFLINE',
          }
        }
      },
      include: {
        payment: true,
        vehicle: { select: { make: true, model: true, ownerId: true } },
      }
    });

    // Notify the vehicle owner about the new incoming rental request
    if (vehicle.ownerId) {
      await createNotification(
        vehicle.ownerId,
        'New Rental Request',
        `A customer requested to rent your ${vehicle.make} ${vehicle.model} from ${start.toLocaleDateString()} to ${end.toLocaleDateString()}. Please review and accept or reject the request.`,
        'BOOKING'
      );
    }

    res.status(201).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating booking' });
  }
};

export const getOwnerBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { vehicle: { ownerId: req.user.id } },
      include: {
        vehicle: { select: { id: true, make: true, model: true, dailyPrice: true, location: true, images: true } },
        customer: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
        payment: true
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching owner bookings' });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { customerId: req.user.id },
      include: {
        vehicle: {
          select: {
            id: true,
            make: true,
            model: true,
            images: true,
            location: true,
            owner: { select: { firstName: true, lastName: true, email: true, phone: true } }
          }
        },
        payment: true,
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Owner or Admin accepts/rejects rental request and verifies payment
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        payment: true,
        vehicle: { select: { id: true, make: true, model: true, ownerId: true } },
        customer: { select: { id: true, firstName: true, lastName: true, email: true } },
      }
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const isAdmin = req.user.role === 'ADMIN';
    const isOwner = req.user.id === booking.vehicle.ownerId;
    const isCustomer = req.user.id === booking.customerId;

    if (!isAdmin && !isOwner && !isCustomer) {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    // Role-specific permission enforcement:
    // Customer can ONLY cancel their own booking (if it's not already completed)
    if (isCustomer && !isOwner && !isAdmin) {
      if (status && status !== 'CANCELLED') {
        return res.status(403).json({ message: 'Only the vehicle owner or an administrator can accept, reject, or modify booking status' });
      }
      if (paymentStatus) {
        return res.status(403).json({ message: 'Customers cannot modify payment verification status' });
      }
    }

    // Only Owner or Admin can accept (APPROVED) or reject (REJECTED) rental requests
    if (status && (status === 'APPROVED' || status === 'REJECTED' || status === 'ACTIVE' || status === 'COMPLETED') && !isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Only the vehicle owner or an administrator can accept or reject rental requests' });
    }

    // Only Owner or Admin can verify offline payment
    if (paymentStatus && !isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Only the vehicle owner or an administrator can verify payments' });
    }

    let bookingUpdateData = {};
    if (status) bookingUpdateData.status = status;

    let paymentUpdateData = {};
    if (paymentStatus) {
      paymentUpdateData.status = paymentStatus;
      if (paymentStatus === 'PAID_OFFLINE' && (isOwner || isAdmin)) {
        paymentUpdateData.ownerVerified = true;
      }
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        ...bookingUpdateData,
        ...(Object.keys(paymentUpdateData).length > 0 && {
          payment: {
            update: paymentUpdateData
          }
        })
      },
      include: {
        payment: true,
        vehicle: true,
        customer: { select: { id: true, firstName: true, lastName: true, email: true } },
      }
    });

    // Notify customer when owner/admin changes booking status
    if (status && booking.customerId && (isOwner || isAdmin)) {
      let title = `Rental Request ${status}`;
      let message = `Your rental request for ${booking.vehicle.make} ${booking.vehicle.model} has been updated to ${status}.`;

      if (status === 'APPROVED') {
        title = 'Rental Request Accepted! 🎉';
        message = `Great news! The owner has accepted your rental request for ${booking.vehicle.make} ${booking.vehicle.model}. Please prepare the offline payment of $${booking.totalAmount} for vehicle pickup.`;
      } else if (status === 'REJECTED') {
        title = 'Rental Request Declined';
        message = `The owner was unable to accept your rental request for ${booking.vehicle.make} ${booking.vehicle.model} for the selected dates.`;
      } else if (status === 'ACTIVE') {
        title = 'Rental In Progress 🚗';
        message = `Your rental for ${booking.vehicle.make} ${booking.vehicle.model} is now active. Enjoy your drive!`;
      } else if (status === 'COMPLETED') {
        title = 'Rental Completed ✅';
        message = `Your rental for ${booking.vehicle.make} ${booking.vehicle.model} has been completed. Thank you!`;
      }

      await createNotification(booking.customerId, title, message, 'BOOKING');
    }

    // If customer cancelled, notify the owner
    if (status === 'CANCELLED' && isCustomer && booking.vehicle.ownerId) {
      await createNotification(
        booking.vehicle.ownerId,
        'Booking Cancelled',
        `The customer cancelled their rental request for ${booking.vehicle.make} ${booking.vehicle.model}.`,
        'BOOKING'
      );
    }

    res.json(updatedBooking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating booking' });
  }
};
