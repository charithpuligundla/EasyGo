import { prisma } from '../index.js';

export const createOrganization = async (req, res) => {
  try {
    const { name, businessRegNo, gstNumber } = req.body;

    const org = await prisma.organization.create({
      data: {
        name,
        businessRegNo,
        gstNumber,
        ownerId: req.user.id,
      },
    });

    res.status(201).json(org);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating organization' });
  }
};

export const getMyOrganizations = async (req, res) => {
  try {
    const orgs = await prisma.organization.findMany({
      where: { ownerId: req.user.id },
      include: { vehicles: true },
    });
    res.json(orgs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
