'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Product {
  id: number
  name: string
  category: string
  published: boolean
  soldOut: boolean
  price: string
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/admin/products')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
      setError('Failed to fetch products. Please try again later.')
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
        await fetchProducts()
        router.refresh()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update product')
      }
    } catch (error) {
      console.error('Error updating product:', error)
      alert(`Failed to update product: ${(error as Error).message}`)
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
        await fetchProducts()
        router.refresh()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update product')
      }
    } catch (error) {
      console.error('Error updating product:', error)
      alert(`Failed to update product: ${(error as Error).message}`)
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`/api/admin/products/${id}`, {
          method: 'DELETE',
        })
        if (response.ok) {
          await fetchProducts()
          router.refresh()
        } else {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to delete product')
        }
      } catch (error) {
        console.error('Error deleting product:', error)
        alert(`Failed to delete product: ${(error as Error).message}`)
      }
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
      <Link 
        href="/"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4 inline-block"
        onClick={(e) => {
          e.preventDefault()
          router.refresh()
          window.location.href = '/'
        }}
      >
        View Front Page
      </Link>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
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
              Category
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
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {product.category}
                </span>
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
                <Link href={`/admin/edit-product/${product.id}`} className="text-blue-500 hover:underline mr-2">
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

