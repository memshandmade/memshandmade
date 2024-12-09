import Image from 'next/image'
import Link from 'next/link'
import { Prisma } from '@prisma/client'

type ProductWithoutDates = Omit<Prisma.ProductGetPayload<{}>, 'createdAt' | 'updatedAt'>

interface SingleProductProps {
  product: ProductWithoutDates
}

export default function SingleProduct({ product }: SingleProductProps) {
  const images = [product.image1, product.image2, product.image3, product.image4, product.image5].filter(Boolean) as string[]

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="text-blue-500 hover:underline mb-4 inline-block">&larr; Back to all products</Link>
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="grid grid-cols-2 gap-4">
            {images.map((image, index) => (
              <div key={index} className="aspect-square relative">
                <Image
                  src={image}
                  alt={`${product.name} - Image ${index + 1}`}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="prose max-w-none mb-4" dangerouslySetInnerHTML={{ __html: product.intro }} />
          <div className="prose max-w-none mb-4" dangerouslySetInnerHTML={{ __html: product.description }} />
          <p className="text-2xl font-bold mb-4">${product.price.toFixed(2)}</p>
          {product.soldOut ? (
            <p className="text-red-500 font-bold">Sold Out</p>
          ) : (
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Add to Cart</button>
          )}
        </div>
      </div>
    </div>
  )
}

