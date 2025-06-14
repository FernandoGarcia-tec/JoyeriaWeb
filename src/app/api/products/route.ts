
import { NextResponse } from 'next/server';
import { getAllProducts } from '@/lib/data';

// This ensures that the API route is always dynamically rendered
// and fetches the fresh product data on every request.
export const dynamic = 'force-dynamic';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // For development, allow all. For production, specify your frontend origin.
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new Response(null, {
    status: 204, // No Content
    headers: corsHeaders,
  });
}

export async function GET() {
  try {
    const products = getAllProducts();
    return NextResponse.json(products, {
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("API Error - Failed to fetch products:", error);
    return NextResponse.json({ message: "Internal Server Error: Failed to fetch products" }, {
      status: 500,
      headers: corsHeaders,
    });
  }
}
