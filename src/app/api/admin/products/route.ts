import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, intro, description, price, published, soldOut } = body

    const product = await prisma.product.create({
      data: {
        name,
        intro,
        description,
        price,
        published,
        soldOut,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Failed to create product:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}

// Keep the existing GET method as is

