import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import SingleProduct from '@/components/SingleProduct'
import { Prisma } from '@prisma/client'

type Product = Prisma.ProductGetPayload<{}>

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

  return <SingleProduct product={product} />
}