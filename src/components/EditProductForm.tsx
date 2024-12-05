'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from 'next/image'
import ToolBar from "@/components/ToolBar";

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
  const router = useRouter()

  const introEditor = useEditor({
    extensions: [
        StarterKit.configure({   
            // Configure an included extension
            heading: {
              levels: [1, 2, 3],
            },
          }), 
    ],
    content: product.intro,
    immediatelyRender: false,
  })

  const descriptionEditor = useEditor({
    extensions: [
        StarterKit.configure({   
            // Configure an included extension
            heading: {
              levels: [1, 2, 3],
            },
          }), 
    ],
    content: product.description,
    immediatelyRender: false,
  })

  useEffect(() => {
    if (introEditor && !introEditor.isDestroyed) {
      introEditor.commands.setContent(product.intro)
    }
    if (descriptionEditor && !descriptionEditor.isDestroyed) {
      descriptionEditor.commands.setContent(product.description)
    }
  }, [product, introEditor, descriptionEditor])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const newImages = [...images, ...files].slice(0, 5)
    setImages(newImages)

    const newPreviews = newImages.map(file => URL.createObjectURL(file))
    setImagePreviews(newPreviews)
  }

  const removeImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    setImages(newImages)

    const newPreviews = [...imagePreviews]
    newPreviews.splice(index, 1)
    setImagePreviews(newPreviews)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('name', name)
    formData.append('intro', introEditor?.getHTML() || '')
    formData.append('description', descriptionEditor?.getHTML() || '')
    formData.append('price', price)
    formData.append('published', published.toString())
    formData.append('soldOut', soldOut.toString())
    images.forEach((image, index) => {
      formData.append(`image${index + 1}`, image)
    })

    const response = await fetch(`/api/admin/products/${product.id}`, {
      method: 'PUT',
      body: formData,
    })

    if (response.ok) {
      router.push('/admin')
    } else {
      console.error('Failed to update product')
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
        <ToolBar editor={introEditor} />
        <EditorContent editor={introEditor} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <ToolBar editor={descriptionEditor} />
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
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Update Product
      </button>
    </form>
  )
}

