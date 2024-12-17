'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

interface Product {
  id: number
  name: string
  intro: string
  description: string
  price: string
  image1: string | null
  image2: string | null
  image3: string | null
  image4: string | null
  image5: string | null
  published: boolean
  soldOut: boolean
}

const MAX_FILE_SIZE = 500 * 1024 // 500KB

export default function EditProductForm({ product }: { product: Product }) {
  const [name, setName] = useState(product.name)
  const [price, setPrice] = useState(product.price)
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([
    product.image1,
    product.image2,
    product.image3,
    product.image4,
    product.image5,
  ].filter((img): img is string => img !== null))
  const [published, setPublished] = useState(product.published)
  const [soldOut, setSoldOut] = useState(product.soldOut)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const introEditor = useEditor({
    extensions: [StarterKit],
    content: product.intro,
  })

  const descriptionEditor = useEditor({
    extensions: [StarterKit],
    content: product.description,
  })

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newImages: File[] = []
    const newPreviews: string[] = []

    for (const file of files) {
      try {
        const compressedBlob = await compressImage(file)
        const compressedFile = new File([compressedBlob], file.name, { type: file.type })
        newImages.push(compressedFile)
        newPreviews.push(URL.createObjectURL(compressedFile))
      } catch (error) {
        console.error('Error compressing image:', error)
      }
    }

    setImages((prevImages) => [...prevImages, ...newImages].slice(0, 5))
    setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews].slice(0, 5))
  }

  const removeImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)

    const newPreviews = [...imagePreviews]
    newPreviews.splice(index, 1)
    setImagePreviews(newPreviews)
  }

  async function compressImage(file: File): Promise<Blob> {
    const imageBitmap = await createImageBitmap(file)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!

    const scaleFactor = Math.sqrt(MAX_FILE_SIZE / file.size)
    canvas.width = imageBitmap.width * scaleFactor
    canvas.height = imageBitmap.height * scaleFactor

    ctx.drawImage(imageBitmap, 0, 0, canvas.width, canvas.height)

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('Canvas to Blob conversion failed'))
          }
        },
        file.type,
        0.7
      )
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('intro', introEditor?.getHTML() || '')
      formData.append('description', descriptionEditor?.getHTML() || '')
      formData.append('price', price)
      formData.append('published', published.toString())
      formData.append('soldOut', soldOut.toString())

      // Append images
      images.forEach((image, index) => {
        formData.append(`image${index + 1}`, image)
      })

      // Append existing image URLs
      imagePreviews.forEach((preview, index) => {
        if (preview.startsWith('http')) {
          formData.append(`existingImage${index + 1}`, preview)
        }
      })

      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to update product')
      }

      router.push('/admin')
    } catch (error) {
      console.error('Error updating product:', error)
      alert('Failed to update product. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        />
      </div>
      <div>
        <label htmlFor="intro" className="block text-sm font-medium text-gray-700">Intro</label>
        <EditorContent editor={introEditor} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <EditorContent editor={descriptionEditor} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
      </div>
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price</label>
        <input
          type="number"
          id="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
          step="0.01"
        />
      </div>
      <div>
        <label htmlFor="images" className="block text-sm font-medium text-gray-700">Images (up to 5)</label>
        <input
          type="file"
          id="images"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="mt-1 block w-full"
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {imagePreviews.map((preview, index) => (
            <div key={index} className="relative">
              <Image src={preview} alt={`Preview ${index + 1}`} width={100} height={100} className="object-cover" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="mr-2"
          />
          Published
        </label>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            checked={soldOut}
            onChange={(e) => setSoldOut(e.target.checked)}
            className="mr-2"
          />
          Sold Out
        </label>
      </div>
      <button 
        type="submit" 
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Updating Product...' : 'Update Product'}
      </button>
    </form>
  )
}

