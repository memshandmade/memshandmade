import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { v2 as cloudinary } from 'cloudinary'
import sharp from 'sharp'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB

async function processImage(file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  
  let processedBuffer = await sharp(buffer)
    .resize(1600, 1200, { fit: 'inside', withoutEnlargement: true })
    .toBuffer()

  if (processedBuffer.length > MAX_FILE_SIZE) {
    let quality = 80
    while (processedBuffer.length > MAX_FILE_SIZE && quality > 10) {
      processedBuffer = await sharp(buffer)
        .resize(1600, 1200, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality })
        .toBuffer()
      quality -= 10
    }
  }

  return processedBuffer
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      select: { id: true, name: true, published: true, soldOut: true, price: true },
    })
    
    // Convert Decimal to string for JSON serialization
    const serializedProducts = products.map(product => ({
      ...product,
      price: product.price.toString()
    }))
    
    return NextResponse.json(serializedProducts)
  } catch (error) {
    console.error('Failed to fetch products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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
      try {
        const processedImageBuffer = await processImage(image)
        const base64Image = processedImageBuffer.toString('base64')
        const dataURI = `data:${image.type};base64,${base64Image}`
        
        const result = await cloudinary.uploader.upload(dataURI, {
          folder: 'soft-toys',
        })
        imageUrls.push(result.secure_url)
      } catch (error) {
        console.error(`Failed to process and upload image ${i}:`, error)
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
        published,
        soldOut,
        image1: imageUrls[0] || null,
        image2: imageUrls[1] || null,
        image3: imageUrls[2] || null,
        image4: imageUrls[3] || null,
        image5: imageUrls[4] || null,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Failed to create product:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}

