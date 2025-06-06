import { NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/data';

// This ensures that the API route is always dynamically rendered
// and fetches the fresh product data on every request.
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const products = getAllProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error("API Error - Failed to fetch products:", error);
    return NextResponse.json({ message: "Internal Server Error: Failed to fetch products" }, { status: 500 });
  }
}
