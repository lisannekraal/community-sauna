import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { hashPassword } from '@/lib/password';
import type { RegisterFormData } from '@/types';

export async function POST(request: Request) {
  try {
    const body: RegisterFormData = await request.json();

    const { email, password, firstName, lastName, phone, gender, emergencyContactName, emergencyContactPhone } = body;

    if (!email || !password || !firstName || !phone) {
      return NextResponse.json(
        { error: 'Email, password, first name, and phone are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        phone,
        gender: gender as 'male' | 'female' | 'non_binary' | 'other' | 'prefer_not_to_say' | undefined,
        emergencyContactName,
        emergencyContactPhone,
      },
    });

    return NextResponse.json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
