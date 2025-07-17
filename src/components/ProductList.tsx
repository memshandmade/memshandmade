"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Footer from "@/components/Footer"

interface Product {
  id: number
  name: string
  intro: string
  description: string
  price: string
  category: string
  image1: string | null
  image2: string | null
  image3: string | null
  image4: string | null
  image5: string | null
  published: boolean
  soldOut: boolean
}

const CATEGORIES = [
  "All",
  "General",
  "Art Dolls",
  "Baby Toys",
]

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [selectedCategory])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const url =
        selectedCategory === "All"
          ? "/api/admin/products"
          : `/api/admin/products?category=${encodeURIComponent(selectedCategory)}`

      const response = await fetch(url)
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading products...</div>
  }

  return (
    <div>
      {/* Category Filter */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Filter by Category</h3>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg p-4">
            <Image
              src={product.image1 || "/placeholder1.png"}
              alt={product.name}
              width={300}
              height={256}
              className="w-full h-64 object-cover mb-4"
            />
            <div className="mb-2">
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {product.category}
              </span>
            </div>
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <div className="text-gray-600 mb-2" dangerouslySetInnerHTML={{ __html: product.intro }} />
            <p className="font-bold mb-2">thb {Number.parseFloat(product.price).toFixed(2)}</p>
            
            {product.soldOut? (
                  <>
                      
                      <p className="stroke-destructive soldout">Sold Out</p>
                  </>
              ) : (
                  <>
                      
                      <p>Available</p>
                  </>
              )}

          <p className="text-2xl font-bold mb-4">{product.soldOut}</p>
          <Button asChild size="lg" className="w-full buttoncolor">
            <Link 
              href={`/products/${product.id}`}
            >
              View Details
            </Link>
          </Button>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No products found in this category.</p>
        </div>
      )}

          {!loading && (
            <footer>
              <Footer />
            </footer>
          )}

    </div>
    
  )
}
