import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY;

    if (!CHAPA_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Chapa secret key is not configured' },
        { status: 500 }
      );
    }

    const response = await fetch('https://api.chapa.co/v1/transaction/initialize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CHAPA_SECRET_KEY}`
      },
      body: JSON.stringify({
        ...body,
        currency: 'ETB',
        return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/give/thank-you`,
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Chapa API error:', data);
      return NextResponse.json(
        { error: data.message || 'Failed to initialize payment' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Payment processing error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your payment' },
      { status: 500 }
    );
  }
}
