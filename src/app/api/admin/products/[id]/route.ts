import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function PATCH(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = parseInt(params.id)
  const { published, soldOut } = await request.json()

  try {
    const product = await prisma.product.update({
      where: { id },
      data: { 
        published: published !== undefined ? published : undefined,
        soldOut: soldOut !== undefined ? soldOut : undefined
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Failed to update product:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = parseInt(params.id)
  const formData = await request.formData()

  const name = formData.get('name') as string
  const intro = formData.get('intro') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const published = formData.get('published') === 'true'
  const soldOut = formData.get('soldOut') === 'true'

  const imageUrls: string[] = []

  for (let i = 1; i <= 5; i++) {
    const image = formData.get(`image${i}`) as File | null
    if (image) {
      const buffer = await image.arrayBuffer()
      const base64Image = Buffer.from(buffer).toString('base64')
      const dataURI = `data:${image.type};base64,${base64Image}`
      
      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'soft-toys',
      })
      imageUrls.push(result.secure_url)
    }
  }

  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        intro,
        description,
        price,
        published,
        soldOut,
        image1: imageUrls[0] || undefined,
        image2: imageUrls[1] || undefined,
        image3: imageUrls[2] || undefined,
        image4: imageUrls[3] || undefined,
        image5: imageUrls[4] || undefined,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Failed to update product:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

