import { prisma, io } from '../index.js';

const canAccessBooking = (booking, user) =>
  user.role === 'ADMIN' ||
  booking.customerId === user.id ||
  booking.vehicle?.ownerId === user.id ||
  booking.vehicle?.organization?.ownerId === user.id;

// GET /api/chats - Fetch all conversations for the authenticated user
export const getUserChats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all chats where user is either the customer, vehicle owner, or has sent/received messages
    const chats = await prisma.chat.findMany({
      where: {
        OR: [
          { booking: { customerId: userId } },
          { booking: { vehicle: { ownerId: userId } } },
          { booking: { vehicle: { organization: { ownerId: userId } } } },
          { messages: { some: { OR: [{ senderId: userId }, { receiverId: userId }] } } },
        ],
      },
      include: {
        booking: {
          include: {
            vehicle: {
              include: {
                images: true,
                owner: { select: { id: true, firstName: true, lastName: true, avatar: true } },
                organization: { select: { name: true, logo: true } },
              },
            },
            customer: { select: { id: true, firstName: true, lastName: true, avatar: true, email: true } },
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            sender: { select: { id: true, firstName: true, lastName: true } },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    res.json(chats);
  } catch (error) {
    console.error('Error fetching user chats:', error);
    res.status(500).json({ message: 'Server error retrieving chats' });
  }
};

// GET /api/chats/booking/:bookingId - Fetch or initialize chat for a booking
export const getOrCreateChat = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        vehicle: {
          include: {
            images: true,
            owner: { select: { id: true, firstName: true, lastName: true, email: true, avatar: true } },
            organization: { select: { id: true, name: true, logo: true, ownerId: true } },
          },
        },
        customer: { select: { id: true, firstName: true, lastName: true, email: true, avatar: true } },
        chat: {
          include: {
            messages: {
              orderBy: { createdAt: 'asc' },
              include: {
                sender: { select: { id: true, firstName: true, lastName: true, avatar: true } },
              },
            },
          },
        },
      },
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (!canAccessBooking(booking, req.user)) {
      return res.status(403).json({ message: 'Not authorized to access this conversation' });
    }

    let chat = booking.chat;
    if (!chat) {
      chat = await prisma.chat.create({
        data: { bookingId },
        include: {
          messages: true,
        },
      });
      chat.messages = [];
    }

    // Attach booking and vehicle info to chat for convenient UI display
    res.json({
      ...chat,
      booking: {
        id: booking.id,
        status: booking.status,
        startDate: booking.startDate,
        endDate: booking.endDate,
        totalAmount: booking.totalAmount,
        customer: booking.customer,
        vehicle: booking.vehicle,
      },
    });
  } catch (error) {
    console.error('Error getting or creating chat:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/chats/booking/:bookingId/messages - Send message
export const sendMessage = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { content } = req.body;

    if (!content?.trim()) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        vehicle: {
          include: {
            organization: true,
          },
        },
        chat: true,
      },
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (!canAccessBooking(booking, req.user)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    let chatId = booking.chat?.id;
    if (!chatId) {
      const chat = await prisma.chat.create({ data: { bookingId } });
      chatId = chat.id;
    }

    // Determine receiver
    let receiverId;
    if (req.user.id === booking.customerId) {
      receiverId = booking.vehicle?.ownerId || booking.vehicle?.organization?.ownerId;
    } else {
      receiverId = booking.customerId;
    }

    if (!receiverId) {
      const fallback = await prisma.user.findFirst({
        where: { id: { not: req.user.id } },
      });
      receiverId = fallback?.id;
    }

    if (!receiverId) {
      return res.status(400).json({ message: 'Cannot determine recipient' });
    }

    const message = await prisma.message.create({
      data: {
        chatId,
        senderId: req.user.id,
        receiverId,
        content: content.trim(),
      },
      include: {
        sender: {
          select: { id: true, firstName: true, lastName: true, avatar: true },
        },
      },
    });

    // Update chat updatedAt timestamp
    await prisma.chat.update({
      where: { id: chatId },
      data: { updatedAt: new Date() },
    });

    // Create notification for receiver
    try {
      await prisma.notification.create({
        data: {
          userId: receiverId,
          title: `New Message from ${req.user.firstName || 'User'}`,
          message: content.trim().length > 60 ? `${content.trim().substring(0, 60)}...` : content.trim(),
          type: 'MESSAGE',
        },
      });
    } catch (e) {
      console.warn('Failed to create notification:', e);
    }

    // Emit live via Socket.io
    if (io) {
      io.to(chatId).emit('receive_message', message);
      io.emit(`chat_${chatId}`, message);
      io.emit(`user_message_${receiverId}`, message);
    }

    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
