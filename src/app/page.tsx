import ProductList from '@/components/ProductList'


export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Soft Toy Store</h1>
      <h2 className="text-2xl font-semibold mb-4">Our Products</h2>
      <ProductList />

    </main>
  )
}

