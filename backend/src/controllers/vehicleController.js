import { prisma } from '../index.js';

export const getVehicles = async (req, res) => {
  try {
    const { type, location, ownerId, priceMax, startDate, endDate, sort } = req.query;
    let filter = {};

    if (type) {
      filter.type = type;
    }
    if (location) {
      filter.location = { contains: location }; // SQLite prisma string filter
    }
    if (ownerId) {
      filter.ownerId = ownerId;
    }
    if (priceMax && Number.isFinite(Number(priceMax))) filter.dailyPrice = { lte: Number(priceMax) };

    if (startDate || endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (!startDate || !endDate || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
        return res.status(400).json({ message: 'A valid date range is required' });
      }
      filter.bookings = {
        none: {
          status: { in: ['PENDING', 'APPROVED', 'ACTIVE'] },
          startDate: { lt: end },
          endDate: { gt: start },
        },
      };
    }

    const vehicles = await prisma.vehicle.findMany({
      where: filter,
      orderBy: sort === 'priceAsc' ? { dailyPrice: 'asc' } : sort === 'priceDesc' ? { dailyPrice: 'desc' } : { createdAt: 'desc' },
      include: {
        images: true,
        owner: { select: { firstName: true, lastName: true } },
        organization: { select: { name: true } },
      },
    });

    res.json(vehicles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getVehicleById = async (req, res) => {
  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: req.params.id },
      include: {
        images: true,
        owner: { select: { firstName: true, lastName: true } },
        organization: { select: { name: true, logo: true } },
        reviews: {
          include: { reviewer: { select: { firstName: true, lastName: true, avatar: true } } },
        },
      },
    });

    if (vehicle) {
      res.json(vehicle);
    } else {
      res.status(404).json({ message: 'Vehicle not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createVehicle = async (req, res) => {
  try {
    const { 
      make, model, year, type, description, dailyPrice, securityDeposit, location, 
      organizationId, seats, transmission, fuelType 
    } = req.body;

    const parsedYear = parseInt(year);
    const parsedPrice = parseFloat(dailyPrice);
    const parsedDeposit = parseFloat(securityDeposit);
    const parsedSeats = parseInt(seats);

    if (!make || !model || !location || !Number.isInteger(parsedYear) || parsedYear < 1900 || parsedYear > new Date().getFullYear() + 1 || !Number.isFinite(parsedPrice) || parsedPrice <= 0 || !Number.isFinite(parsedDeposit) || parsedDeposit < 0 || !Number.isInteger(parsedSeats) || parsedSeats < 1) {
      return res.status(400).json({ message: 'Invalid vehicle details' });
    }

    if (organizationId) {
      const organization = await prisma.organization.findFirst({ where: { id: organizationId, ownerId: req.user.id } });
      if (!organization) return res.status(403).json({ message: 'Organization access denied' });
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        ownerId: req.user.id,
        organizationId: organizationId || null,
        make,
        model,
        year: parsedYear,
        type,
        description,
        dailyPrice: parsedPrice,
        securityDeposit: parsedDeposit,
        location,
        seats: parsedSeats,
        transmission,
        fuelType,
      },
    });

    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      const imageRecords = req.files.map((file, index) => ({
        vehicleId: vehicle.id,
        url: `/uploads/vehicle-images/${file.filename}`,
        isPrimary: index === 0,
      }));

      await prisma.vehicleImage.createMany({
        data: imageRecords,
      });
    }

    const createdVehicle = await prisma.vehicle.findUnique({
      where: { id: vehicle.id },
      include: { images: true },
    });

    res.status(201).json(createdVehicle);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating vehicle' });
  }
};

const ownerCanManage = (vehicle, user) => user.role === 'ADMIN' || vehicle.ownerId === user.id;

export const updateVehicle = async (req, res) => {
  const vehicle = await prisma.vehicle.findUnique({ where: { id: req.params.id } });
  if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
  if (!ownerCanManage(vehicle, req.user)) return res.status(403).json({ message: 'Vehicle access denied' });

  const allowedFields = ['make', 'model', 'year', 'type', 'description', 'dailyPrice', 'securityDeposit', 'location', 'seats', 'transmission', 'fuelType'];
  const data = Object.fromEntries(Object.entries(req.body).filter(([key, value]) => allowedFields.includes(key) && value !== undefined));
  for (const key of ['year', 'seats']) if (data[key] !== undefined) data[key] = Number.parseInt(data[key], 10);
  for (const key of ['dailyPrice', 'securityDeposit']) if (data[key] !== undefined) data[key] = Number.parseFloat(data[key]);

  try {
    const updated = await prisma.vehicle.update({ where: { id: vehicle.id }, data, include: { images: true } });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: 'Invalid vehicle details' });
  }
};

export const deleteVehicle = async (req, res) => {
  const vehicle = await prisma.vehicle.findUnique({ where: { id: req.params.id } });
  if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
  if (!ownerCanManage(vehicle, req.user)) return res.status(403).json({ message: 'Vehicle access denied' });
  await prisma.vehicle.delete({ where: { id: vehicle.id } });
  res.status(204).send();
};
