import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import SingleProduct from '@/components/SingleProduct'

import { Product } from '@prisma/client'

export default async function ProductPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const product = await prisma.product.findUnique({
    where: { id: parseInt(params.id) }
  }) as Product | null

  if (!product) {
    notFound()
  }

  return <SingleProduct product={product} />
}

