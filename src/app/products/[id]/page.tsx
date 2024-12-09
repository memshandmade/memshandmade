import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import SingleProduct from '@/components/SingleProduct'
import { Prisma } from '@prisma/client'

type ProductWithoutDates = Omit<Prisma.ProductGetPayload<{}>, 'createdAt' | 'updatedAt'>

interface PageProps {
  params: { id: string }
}

export default async function ProductPage({ params }: PageProps) {
  const productId = parseInt(params.id)

  if (isNaN(productId)) {
    return notFound()
  }

  const product = await prisma.product.findUnique({
    where: { id: productId }
  })

  if (!product) {
    return notFound()
  }

  // Remove date fields for serialization
  const { createdAt, updatedAt, ...productWithoutDates } = product

  return <SingleProduct product={productWithoutDates} />
}

