import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { v2 as cloudinary } from 'cloudinary'
import sanitizeHtml from 'sanitize-html'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const name = formData.get('name') as string
  const intro = sanitizeHtml(formData.get('intro') as string)
  const description = sanitizeHtml(formData.get('description') as string)
  const price = parseFloat(formData.get('price') as string)

  const imageUrls: string[] = []

  for (let i = 1; i <= 5; i++) {
    const image = formData.get(`image${i}`) as File
    if (image) {
      const buffer = await image.arrayBuffer()
      const base64Image = Buffer.from(buffer).toString('base64')
      const dataURI = `data:${image.type};base64,${base64Image}`
      
      try {
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: 'soft-toys',
        })
        imageUrls.push(result.secure_url)
      } catch (error) {
        console.error(`Failed to upload image ${i}:`, error)
      }
    }
  }

  try {
    const product = await prisma.product.create({
      data: {
        name,
        intro,
        description,
        price,
        image1: imageUrls[0] || null,
        image2: imageUrls[1] || null,
        image3: imageUrls[2] || null,
        image4: imageUrls[3] || null,
        image5: imageUrls[4] || null,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Failed to create product:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}

