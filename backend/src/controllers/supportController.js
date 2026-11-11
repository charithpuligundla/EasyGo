import { prisma } from '../index.js';

export const getMyTickets = async (req, res) => {
  try {
    const tickets = await prisma.supportTicket.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
    });
    res.json(tickets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createTicket = async (req, res) => {
  try {
    const { subject, description } = req.body;
    if (!subject?.trim() || !description?.trim()) {
      return res.status(400).json({ message: 'Subject and description are required' });
    }

    const ticket = await prisma.supportTicket.create({
      data: {
        userId: req.user.id,
        subject: subject.trim(),
        description: description.trim(),
      },
    });
    res.status(201).json(ticket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
