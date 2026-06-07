import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXTAUTH_API_URL || process.env.API_URL || 'http://localhost:4000';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch(`${API_URL}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        companyName: body.companyName,
        companySize: body.companySize,
        industry: body.industry,
        adminName: body.adminName,
        email: body.email,
        phone: body.phone,
        telegramId: body.telegramId || null,
        password: body.password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { message: data.message || 'Ro\'yxatdan o\'tishda xato' },
        { status: res.status },
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: 'Server bilan bog\'lanishda xato' },
      { status: 500 },
    );
  }
}
