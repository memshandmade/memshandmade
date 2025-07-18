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

export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = parseInt(params.id)
  const formData = await request.formData()

  const name = formData.get('name') as string
  const intro = formData.get('intro') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const category = (formData.get("category") as string) || "General"
  const published = formData.get('published') === 'true'
  const soldOut = formData.get('soldOut') === 'true'

  const imageUrls: string[] = []

  // Process new image uploads
  for (let i = 1; i <= 5; i++) {
    const image = formData.get(`image${i}`) as File | null
    if (image) {
      try {
        const buffer = await image.arrayBuffer()
        const processedImageBuffer = await processImage(Buffer.from(buffer))
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

  // Add existing images
  for (let i = 1; i <= 5; i++) {
    const existingImage = formData.get(`existingImage${i}`) as string | null
    if (existingImage) {
      imageUrls.push(existingImage)
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
        category,
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
    console.error('Failed to update product:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}




export async function PATCH(request: NextRequest, props: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  const params = await props.params;
  try {
    const id = parseInt(params.id)
    const { published, soldOut } = await request.json()

    const product = await prisma.product.update({
      where: { id },
      data: { 
        published: published !== undefined ? published : undefined,
        soldOut: soldOut !== undefined ? soldOut : undefined
      },
    })

    return NextResponse.json({ success: true, product })
  } catch (error) {
    console.error('Failed to update product:', error)
    return NextResponse.json({ success: false, error: 'Failed to update product' }, { status: 500 })
  }
}



export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const id = parseInt(params.id)

    const product = await prisma.product.delete({
      where: { id },
    })

    // Delete images from Cloudinary
    const imagesToDelete = [product.image1, product.image2, product.image3, product.image4, product.image5]
      .filter((url): url is string => url !== null)
    for (const imageUrl of imagesToDelete) {
      const publicId = imageUrl.split('/').pop()?.split('.')[0] ?? ''
      if (publicId) {
        await cloudinary.uploader.destroy(`soft-toys/${publicId}`)
      }
    }

    return NextResponse.json({ success: true, message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Failed to delete product:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete product' }, { status: 500 })
  }
}

