import { prisma } from '../index.js';

export const createReview = async (req, res) => {
  try {
    const { vehicleId, rating, comment } = req.body;
    const parsedRating = Number.parseInt(rating, 10);

    if (!vehicleId || !Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      return res.status(400).json({ message: 'Invalid review data' });
    }

    const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

    const review = await prisma.review.create({
      data: {
        vehicleId,
        reviewerId: req.user.id,
        ownerId: vehicle.ownerId,
        organizationId: vehicle.organizationId,
        rating: parsedRating,
        comment: comment || null,
      },
      include: {
        reviewer: { select: { firstName: true, lastName: true, avatar: true } },
      },
    });

    res.status(201).json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
