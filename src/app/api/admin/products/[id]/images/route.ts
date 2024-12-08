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

async function processImage(file: Buffer): Promise<Buffer> {
  let processedBuffer = await sharp(file)
    .resize(1600, 1200, { fit: 'inside', withoutEnlargement: true })
    .toBuffer()

  if (processedBuffer.length > MAX_FILE_SIZE) {
    let quality = 80
    while (processedBuffer.length > MAX_FILE_SIZE && quality > 10) {
      processedBuffer = await sharp(file)
        .resize(1600, 1200, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality })
        .toBuffer()
      quality -= 10
    }
  }

  return processedBuffer
}

export async function POST(
    request: NextRequest & { params: { id: string } }
): Promise<NextResponse> {
  const productId = parseInt(request.params.id)

  try {
    const formData = await request.formData()
    const image = formData.get('image') as File | null

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    const buffer = await image.arrayBuffer()
    const processedImageBuffer = await processImage(Buffer.from(buffer))
    const base64Image = processedImageBuffer.toString('base64')
    const dataURI = `data:${image.type};base64,${base64Image}`

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'soft-toys',
    })

    const product = await prisma.product.findUnique({ where: { id: productId } })

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Find the first empty image slot
    let imageField: 'image1' | 'image2' | 'image3' | 'image4' | 'image5' | null = null
    for (let i = 1; i <= 5; i++) {
      const field = `image${i}` as 'image1' | 'image2' | 'image3' | 'image4' | 'image5'
      if (!product[field]) {
        imageField = field
        break
      }
    }

    if (!imageField) {
      return NextResponse.json({ error: 'No available image slots' }, { status: 400 })
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: { [imageField]: result.secure_url },
    })

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error('Failed to upload image:', error)
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 })
  }
}

