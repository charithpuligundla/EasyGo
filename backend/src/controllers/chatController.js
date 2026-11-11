import { prisma } from '../index.js';

const canAccessBooking = (booking, user) =>
  user.role === 'ADMIN' ||
  booking.customerId === user.id ||
  booking.vehicle.ownerId === user.id;

export const getOrCreateChat = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { vehicle: true, chat: { include: { messages: { orderBy: { createdAt: 'asc' }, include: { sender: { select: { firstName: true, lastName: true } } } } } } },
    });

    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (!canAccessBooking(booking, req.user)) return res.status(403).json({ message: 'Not authorized' });

    let chat = booking.chat;
    if (!chat) {
      chat = await prisma.chat.create({
        data: { bookingId },
        include: { messages: true },
      });
    }

    res.json(chat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { content } = req.body;

    if (!content?.trim()) return res.status(400).json({ message: 'Message content is required' });

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { vehicle: true, chat: true },
    });

    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (!canAccessBooking(booking, req.user)) return res.status(403).json({ message: 'Not authorized' });

    let chatId = booking.chat?.id;
    if (!chatId) {
      const chat = await prisma.chat.create({ data: { bookingId } });
      chatId = chat.id;
    }

    const receiverId =
      req.user.id === booking.customerId ? booking.vehicle.ownerId : booking.customerId;

    if (!receiverId) return res.status(400).json({ message: 'Cannot determine message recipient' });

    const message = await prisma.message.create({
      data: {
        chatId,
        senderId: req.user.id,
        receiverId,
        content: content.trim(),
      },
      include: { sender: { select: { firstName: true, lastName: true } } },
    });

    res.status(201).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
