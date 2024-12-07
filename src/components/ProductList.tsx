import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import { Button } from "./ui/button";
import Link from 'next/link'
import { Prisma } from '@prisma/client'
import { unstable_noStore as noStore } from 'next/cache'


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

export default async function ProductList() {
  noStore()
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

  // Serialize the products data
  const serializedProducts: ProductWithoutDates[] = products.map(product => ({
    ...product,
    price: product.price.toString(),
  }))

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {serializedProducts.map((product) => (
        <div key={product.id} className="border rounded-lg p-4">
          <Image
            src={product.image1 || '/placeholder.png'}
            alt={product.name}
            width={300}
            height={300}
            className="w-full h-64 object-cover mb-4"
          />
          <h2 className="text-3xl font-lora text-center">{product.name}</h2>
          <div className="text-gray-600 mb-2" dangerouslySetInnerHTML={{ __html: product.intro }} />
          <p className="font-bold mb-2">thb {parseFloat(product.price).toFixed(2)}</p>
          <Button asChild size="lg" className="w-full">
            <Link 
              href={`/products/${product.id}`}
            >
              View Details
            </Link>
          </Button>
        </div>
      ))}
    </div>
  )
}

