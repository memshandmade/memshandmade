import ProductList from '@/components/ProductList'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Mems Soft Toy Shop</h1>
      <h2 className="text-2xl font-semibold mb-4">Our Products</h2>
      <ProductList />
      <div className="mt-8">
        <Link href="/admin" className="text-blue-500 hover:underline">
          Admin Login
        </Link>
      </div>
    </main>
  )
}

