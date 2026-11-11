import { prisma } from '../index.js';

export const getWalletHistory = async (req, res) => {
  try {
    const transactions = await prisma.walletTransaction.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });

    if (transactions.length > 0) {
      return res.json(transactions);
    }

    const bookings = await prisma.booking.findMany({
      where: { customerId: req.user.id },
      include: { payment: true, vehicle: { select: { make: true, model: true } } },
      orderBy: { createdAt: 'desc' },
    });

    const derived = bookings.map((booking) => ({
      id: booking.id,
      amount: booking.totalAmount,
      type: 'DEBIT',
      description: `Rental: ${booking.vehicle.make} ${booking.vehicle.model} (${booking.payment?.status || 'PENDING'})`,
      createdAt: booking.createdAt,
    }));

    res.json(derived);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
