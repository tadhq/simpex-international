// app/api/addToWishlist/route.ts
import { toggleCustomerWishlist } from '@/lib/medusa/api';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { productId } = await req.json();

  try {
    await toggleCustomerWishlist(productId);
    return NextResponse.json({ message: 'Added to wishlist' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to add to wishlist' }, { status: 500 });
  }
}
