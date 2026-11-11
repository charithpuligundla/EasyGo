import { prisma } from '../index.js';

export const getMyFavorites = async (req, res) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user.id },
      include: {
        vehicle: {
          include: { images: true, owner: { select: { firstName: true, lastName: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(favorites.map((f) => f.vehicle));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const addFavorite = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    const favorite = await prisma.favorite.upsert({
      where: { userId_vehicleId: { userId: req.user.id, vehicleId } },
      create: { userId: req.user.id, vehicleId },
      update: {},
    });
    res.status(201).json(favorite);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const removeFavorite = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    await prisma.favorite.deleteMany({
      where: { userId: req.user.id, vehicleId },
    });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
