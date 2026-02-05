import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Seed membership plans
  const plans = [
    {
      name: 'Trial',
      description: 'Free trial membership for new members. Unlimited sessions for 1 month.',
      type: 'subscription' as const,
      priceCents: 0,
      creditsPerMonth: null, // unlimited
      totalCredits: null,
      validityMonths: 1,
      minimumCommitmentMonths: 1,
      autoRenew: false,
      isActive: true,
    },
    {
      name: '2 Credits Monthly',
      description: 'Monthly subscription with 2 sauna sessions per month.',
      type: 'subscription' as const,
      priceCents: 2500,
      creditsPerMonth: 2,
      totalCredits: null,
      validityMonths: null,
      minimumCommitmentMonths: 3,
      autoRenew: true,
      isActive: true,
    },
    {
      name: '4 Credits Monthly',
      description: 'Monthly subscription with 4 sauna sessions per month.',
      type: 'subscription' as const,
      priceCents: 4000,
      creditsPerMonth: 4,
      totalCredits: null,
      validityMonths: null,
      minimumCommitmentMonths: 2,
      autoRenew: true,
      isActive: true,
    },
    {
      name: '8 Credits Monthly',
      description: 'Monthly subscription with 8 sauna sessions per month.',
      type: 'subscription' as const,
      priceCents: 6400,
      creditsPerMonth: 8,
      totalCredits: null,
      validityMonths: null,
      minimumCommitmentMonths: 1,
      autoRenew: true,
      isActive: true,
    },
    {
      name: 'Unlimited Monthly',
      description: 'Monthly subscription with unlimited sauna sessions.',
      type: 'subscription' as const,
      priceCents: 8000,
      creditsPerMonth: null, // unlimited
      totalCredits: null,
      validityMonths: null,
      minimumCommitmentMonths: 1,
      autoRenew: true,
      isActive: true,
    },
    {
      name: 'Punch Card 5',
      description: 'Punch card with 5 sessions. Valid for 3 months.',
      type: 'punch_card' as const,
      priceCents: 7500,
      creditsPerMonth: null,
      totalCredits: 5,
      validityMonths: 3,
      minimumCommitmentMonths: null,
      autoRenew: false,
      isActive: true,
    },
    {
      name: 'Punch Card 10',
      description: 'Punch card with 10 sessions. Valid for 6 months.',
      type: 'punch_card' as const,
      priceCents: 14000,
      creditsPerMonth: null,
      totalCredits: 10,
      validityMonths: 6,
      minimumCommitmentMonths: null,
      autoRenew: false,
      isActive: true,
    },
  ];

  for (const plan of plans) {
    await prisma.membershipPlan.upsert({
      where: { id: plans.indexOf(plan) + 1 },
      update: plan,
      create: plan,
    });
  }

  console.log(`Created ${plans.length} membership plans`);

  // Create superadmin account
  const superadminEmail = process.env.SUPERADMIN_EMAIL || 'admin@community-sauna.local';
  const superadminPassword = process.env.SUPERADMIN_PASSWORD || 'changeme123';
  const hashedPassword = await bcrypt.hash(superadminPassword, 12);

  const superadmin = await prisma.user.upsert({
    where: { email: superadminEmail },
    update: {},
    create: {
      email: superadminEmail,
      passwordHash: hashedPassword,
      firstName: 'Super',
      lastName: 'Admin',
      phone: '+31000000000',
      role: 'superadmin',
    },
  });

  console.log(`Created superadmin: ${superadmin.email}`);
  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
