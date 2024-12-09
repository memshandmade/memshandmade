/* eslint-disable */

import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import Link from 'next/link'
import { Prisma } from '@prisma/client'
import { cache } from 'react'

type ProductWithoutDates = Omit<Prisma.ProductGetPayload<{
  select: {
    id: true;
    name: true;
    intro: true;
    description: true;
    price: true;
    image1: true;
    image2: true;
    image3: true;
    image4: true;
    image5: true;
    published: true;
    soldOut: true;
  }
}>, 'price'> & {
  price: string;
}

const getProducts = cache(async () => {
  const products = await prisma.product.findMany({
    where: { published: true, soldOut: false },
    select: {
      id: true,
      name: true,
      intro: true,
      description: true,
      price: true,
      image1: true,
      image2: true,
      image3: true,
      image4: true,
      image5: true,
      published: true,
      soldOut: true,
    }
  })

  return products.map(product => ({
    ...product,
    price: product.price.toString(),
  }))
})

export default async function ProductList() {
  const products = await getProducts()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.id} className="border rounded-lg p-4">
          <Image
            src={product.image1 || '/placeholder.png'}
            alt={product.name}
            width={300}
            height={300}
            className="w-full h-64 object-cover mb-4"
          />
          <h2 className="text-xl font-semibold">{product.name}</h2>
          <div className="text-gray-600 mb-2" dangerouslySetInnerHTML={{ __html: product.intro }} />
          <p className="font-bold mb-2">${parseFloat(product.price).toFixed(2)}</p>
          <Link 
            href={`/products/${product.id}`}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 inline-block"
          >
            View Details
          </Link>
        </div>
      ))}
    </div>
  )
}

