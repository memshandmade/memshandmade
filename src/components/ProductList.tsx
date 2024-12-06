import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import Link from 'next/link'


export default async function ProductList() {
  const products = await prisma.product.findMany({
    where: { published: true },
  })

  // Serialize the products data
  const serializedProducts = JSON.parse(JSON.stringify(products))

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {serializedProducts.map((product: any) => (
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
          {product.soldOut? (
                            <>
                                
                                <p>Sold Out</p>
                            </>
                        ) : (
                            <>
                                
                                <p className="text-green-500">Available</p>
                            </>
                        )}          
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

