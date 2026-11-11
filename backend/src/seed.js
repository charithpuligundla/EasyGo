import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing database...');
  await prisma.vehicleImage.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();

  console.log('Creating Admin/Owner User...');
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);

  const owner = await prisma.user.create({
    data: {
      email: 'owner@eco-fleet.com',
      password: hashedPassword,
      firstName: 'Eco',
      lastName: 'Fleet',
      role: 'ADMIN',
      isVerified: true
    }
  });

  console.log('Creating Customer User...');
  const customer = await prisma.user.create({
    data: {
      email: 'customer@easygo.com',
      password: hashedPassword,
      firstName: 'John',
      lastName: 'Doe',
      role: 'CUSTOMER',
      isVerified: true
    }
  });

  console.log('Creating Vehicles...');
  const v1 = await prisma.vehicle.create({
    data: {
      owner: { connect: { id: owner.id } },
      make: 'Tesla',
      model: 'Model S Plaid',
      year: 2024,
      type: 'Luxury',
      description: 'Experience the ultimate electric performance.',
      dailyPrice: 350.0,
      securityDeposit: 500.0,
      location: 'San Francisco, CA',
      seats: 5,
      transmission: 'Automatic',
      fuelType: 'Electric'
    }
  });

  const v2 = await prisma.vehicle.create({
    data: {
      owner: { connect: { id: owner.id } },
      make: 'Porsche',
      model: '911 GT3',
      year: 2023,
      type: 'Sports',
      description: 'A true track weapon for the streets.',
      dailyPrice: 800.0,
      securityDeposit: 1500.0,
      location: 'Los Angeles, CA',
      seats: 2,
      transmission: 'Manual',
      fuelType: 'Petrol'
    }
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
