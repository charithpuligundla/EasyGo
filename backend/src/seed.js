import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const vehiclesData = [
  {
    make: 'Ferrari',
    model: '12Cilindri Speciale',
    year: 2024,
    type: 'Supercar',
    description: 'The pinnacle of naturally aspirated Italian engineering. A roaring 830-hp V12 masterpiece with breathtaking exterior styling, carbon aero pack, and racing telemetry.',
    dailyPrice: 1450.0,
    securityDeposit: 2500.0,
    location: 'Beverly Hills, CA',
    seats: 2,
    transmission: 'Automatic Dual-Clutch',
    fuelType: 'Petrol V12',
    imageUrl: '/uploads/vehicle-images/ferrari-12cilindri.avif',
  },
  {
    make: 'Koenigsegg',
    model: 'Jesko Attack',
    year: 2024,
    type: 'Hypercar',
    description: 'Swedish hypercar royalty with active aerodynamics generating 1,400 kg of downforce. 1,600 hp twin-turbo V8 on E85. The ultimate runway rocket.',
    dailyPrice: 3200.0,
    securityDeposit: 5000.0,
    location: 'Las Vegas, NV',
    seats: 2,
    transmission: '9-Speed LST',
    fuelType: 'Twin-Turbo V8',
    imageUrl: '/uploads/vehicle-images/koenigsegg-jesko.jpg',
  },
  {
    make: 'Porsche',
    model: '911 GT3 R Competition',
    year: 2024,
    type: 'Sports',
    description: 'Pure motorsport pedigree tuned for the road and closed circuits. Naturally aspirated 4.0L flat-six, swan-neck carbon wing, and race-tuned chassis.',
    dailyPrice: 950.0,
    securityDeposit: 1800.0,
    location: 'Los Angeles, CA',
    seats: 2,
    transmission: 'PDK 7-Speed',
    fuelType: 'Petrol Flat-6',
    imageUrl: '/uploads/vehicle-images/porsche-gt3r.jpg',
  },
  {
    make: 'Rimac',
    model: 'Nevera Quad-Motor',
    year: 2024,
    type: 'Electric',
    description: 'The record-shattering all-electric hypercar with 1,914 horsepower and 0-60 in 1.74s. Butterfly doors, bespoke luxury cabin, and mind-bending acceleration.',
    dailyPrice: 2800.0,
    securityDeposit: 4000.0,
    location: 'San Francisco, CA',
    seats: 2,
    transmission: 'Single-Speed 4WD',
    fuelType: 'Electric Quad-Motor',
    imageUrl: '/uploads/vehicle-images/rimac-nevera.jpg',
  },
  {
    make: 'Lamborghini',
    model: 'Revuelto V12 Hybrid',
    year: 2024,
    type: 'Luxury',
    description: 'Lamborghini’s premier HPEV (High Performance Electrified Vehicle) blending a ferocious 6.5L V12 with three electric motors producing 1,001 combined horsepower.',
    dailyPrice: 1750.0,
    securityDeposit: 3000.0,
    location: 'Miami Beach, FL',
    seats: 2,
    transmission: '8-Speed Dual-Clutch',
    fuelType: 'Hybrid V12',
    imageUrl: '/uploads/vehicle-images/lamborghini-revuelto.jpg',
  },
  {
    make: 'Lamborghini',
    model: 'Sián FKP 37',
    year: 2023,
    type: 'Supercar',
    description: 'Limited-edition futuristic masterpiece with mild-hybrid supercapacitor technology. Sharp Y-shaped lighting signature, aeronautical-inspired active rear wing.',
    dailyPrice: 2400.0,
    securityDeposit: 4000.0,
    location: 'New York, NY',
    seats: 2,
    transmission: '7-Speed ISR',
    fuelType: 'Hybrid V12 Supercap',
    imageUrl: '/uploads/vehicle-images/lamborghini-sian.jpg',
  },
  {
    make: 'Bugatti',
    model: 'Bolide Track Edition',
    year: 2024,
    type: 'Hypercar',
    description: 'Uncompromising motorsport hyper sports car powered by the iconic 8.0-liter W16 engine delivering 1,850 metric hp in an ultra-light carbon monocoque.',
    dailyPrice: 4500.0,
    securityDeposit: 7500.0,
    location: 'Scottsdale, AZ',
    seats: 2,
    transmission: '7-Speed Dual-Clutch',
    fuelType: 'Quad-Turbo W16',
    imageUrl: '/uploads/vehicle-images/bugatti-bolide.jpg',
  },
  {
    make: 'Ferrari',
    model: 'LaFerrari Aperta',
    year: 2023,
    type: 'Supercar',
    description: 'The defining hypercar of modern Ferrari heritage. 950-hp HY-KERS hybrid V12 with dramatic butterfly doors and spine-tingling exhaust symphony.',
    dailyPrice: 3500.0,
    securityDeposit: 6000.0,
    location: 'Miami, FL',
    seats: 2,
    transmission: 'F1 Dual-Clutch 7-Speed',
    fuelType: 'Hybrid V12 HY-KERS',
    imageUrl: '/uploads/vehicle-images/ferrari-laferrari.jpg',
  },
  {
    make: 'Lamborghini',
    model: 'Terzo Millennio Concept',
    year: 2025,
    type: 'Electric',
    description: 'Vision of future automotive luxury. Ultra-capacitors, carbon nanomaterial self-healing bodywork, four in-wheel electric motors with signature kinetic glow.',
    dailyPrice: 2900.0,
    securityDeposit: 4500.0,
    location: 'Los Angeles, CA',
    seats: 2,
    transmission: 'Direct Drive AWD',
    fuelType: 'Electric Supercapacitor',
    imageUrl: '/uploads/vehicle-images/lamborghini-terzo.jpg',
  },
];

async function main() {
  console.log('Clearing database...');
  await prisma.vehicleImage.deleteMany();
  await prisma.review.deleteMany();
  await prisma.favorite.deleteMany();
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
      firstName: 'Apex',
      lastName: 'Exotics',
      role: 'ADMIN',
      isVerified: true,
    },
  });

  console.log('Creating Customer User...');
  const customer = await prisma.user.create({
    data: {
      email: 'customer@easygo.com',
      password: hashedPassword,
      firstName: 'Alex',
      lastName: 'Vance',
      role: 'CUSTOMER',
      isVerified: true,
    },
  });

  console.log('Seeding Luxury & Exotic Vehicles...');
  for (const car of vehiclesData) {
    const { imageUrl, ...carFields } = car;
    const vehicle = await prisma.vehicle.create({
      data: {
        owner: { connect: { id: owner.id } },
        ...carFields,
        weeklyPrice: Math.round(carFields.dailyPrice * 6.2),
        monthlyPrice: Math.round(carFields.dailyPrice * 24),
        isVerified: true,
      },
    });

    await prisma.vehicleImage.create({
      data: {
        vehicleId: vehicle.id,
        url: imageUrl,
        isPrimary: true,
      },
    });

    // Add a verified 5-star review
    await prisma.review.create({
      data: {
        vehicleId: vehicle.id,
        reviewerId: customer.id,
        rating: 5,
        comment: `Unbelievable experience renting the ${car.make} ${car.model}. Pristine condition, white-glove handover, and breathtaking performance. EasyGo made this dream drive seamless.`,
      },
    });
  }

  console.log('Seeding finished successfully with full luxury fleet.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
