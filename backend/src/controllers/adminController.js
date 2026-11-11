import { prisma } from '../index.js';

export const getAdminStats = async (req, res) => {
  try {
    const [users, vehicles, bookings, organizations, openTickets] = await Promise.all([
      prisma.user.count(),
      prisma.vehicle.count(),
      prisma.booking.count(),
      prisma.organization.count(),
      prisma.supportTicket.count({ where: { status: 'OPEN' } }),
    ]);

    const revenue = await prisma.booking.aggregate({ _sum: { totalAmount: true } });

    res.json({
      users,
      vehicles,
      bookings,
      organizations,
      openTickets,
      totalRevenue: revenue._sum.totalAmount || 0,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        customer: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
        vehicle: {
          select: {
            id: true,
            make: true,
            model: true,
            year: true,
            dailyPrice: true,
            location: true,
            owner: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
            organization: { select: { id: true, name: true } },
          },
        },
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isVerified: true,
        createdAt: true,
        _count: {
          select: {
            vehicles: true,
            bookings: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      include: {
        owner: { select: { id: true, firstName: true, lastName: true, email: true } },
        organization: { select: { id: true, name: true } },
        images: true,
        _count: { select: { bookings: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(vehicles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteVehicleAdmin = async (req, res) => {
  try {
    const vehicle = await prisma.vehicle.findUnique({ where: { id: req.params.id } });
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    await prisma.vehicleImage.deleteMany({ where: { vehicleId: vehicle.id } });
    await prisma.booking.deleteMany({ where: { vehicleId: vehicle.id } });
    await prisma.vehicle.delete({ where: { id: vehicle.id } });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting vehicle' });
  }
};

export const getAllOrganizations = async (req, res) => {
  try {
    const orgs = await prisma.organization.findMany({
      include: {
        owner: { select: { id: true, firstName: true, lastName: true, email: true } },
        _count: { select: { vehicles: true, employees: true, branches: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orgs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const verifyOrganization = async (req, res) => {
  try {
    const org = await prisma.organization.update({
      where: { id: req.params.id },
      data: { isVerified: true },
    });
    res.json(org);
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: 'Organization not found' });
  }
};

export const getPendingOrganizations = async (req, res) => {
  try {
    const orgs = await prisma.organization.findMany({
      where: { isVerified: false },
      include: { owner: { select: { firstName: true, lastName: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(orgs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
