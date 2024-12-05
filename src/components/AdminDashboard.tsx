'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Product {
  id: number
  name: string
  published: boolean
  soldOut: boolean
  price: string
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const router = useRouter()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products')
      if (response.ok) {
        const data = await response.json()
        setProducts(data)
      } else {
        console.error('Failed to fetch products')
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const handlePublishToggle = async (id: number, published: boolean) => {
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published }),
      })
      if (response.ok) {
        fetchProducts()
      } else {
        const errorData = await response.json()
        console.error('Failed to update product:', errorData.error)
        alert(`Failed to update product: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error updating product:', error)
      alert('An error occurred while updating the product')
    }
  }

  const handleSoldOutToggle = async (id: number, soldOut: boolean) => {
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ soldOut }),
      })
      if (response.ok) {
        fetchProducts()
      } else {
        const errorData = await response.json()
        console.error('Failed to update product:', errorData.error)
        alert(`Failed to update product: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error updating product:', error)
      alert('An error occurred while updating the product')
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      router.refresh()
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const formatPrice = (price: string) => {
    if (price === null) return 'N/A'
    return `$${parseFloat(price).toFixed(2)}`
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Link href="/admin/new-product" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Create New Product
        </Link>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Logout
        </button>
      </div>
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Published
            </th>
            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Sold Out
            </th>
            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                {product.name}
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                <button
                  onClick={() => handlePublishToggle(product.id, !product.published)}
                  className={`px-2 py-1 rounded ${
                    product.published ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-800'
                  }`}
                >
                  {product.published ? 'Published' : 'Unpublished'}
                </button>
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                <button
                  onClick={() => handleSoldOutToggle(product.id, !product.soldOut)}
                  className={`px-2 py-1 rounded ${
                    product.soldOut ? 'bg-red-500 text-white' : 'bg-gray-300 text-gray-800'
                  }`}
                >
                  {product.soldOut ? 'Sold Out' : 'In Stock'}
                </button>
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                {formatPrice(product.price)}
              </td>
              <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                <Link href={`/admin/edit-product/${product.id}`} className="text-blue-500 hover:underline">
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

