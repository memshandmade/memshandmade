/* eslint-disable */
'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import ToolBar from "@/components/ToolBar";

interface NewProductFormProps {
  // This interface is intentionally left empty as the component doesn't require any props
}

const MAX_FILE_SIZE = 500 * 1024 // 500KB
const CATEGORIES = [
  "General",
  "Bears",
  "Rabbits",
  "Dogs",
  "Cats",
  "Farm Animals",
  "Wild Animals",
  "Fantasy",
  "Holiday",
  "Baby Toys",
]
export default function NewProductForm({}: NewProductFormProps) {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState("General")
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [published, setPublished] = useState(false)
  const [soldOut, setSoldOut] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const introEditor = useEditor({
    extensions: [      
      StarterKit.configure({   
      // Configure an included extension
      heading: {
        levels: [1, 2, 3],
      },
    }),],
    content: '',
    editorProps: {
      attributes: {
        class:
          "rounded-md border min-h-[150px] border-input bg-background focus:ring-offset-2 disabled:cursor-not-allows disabled:opacity-50 p-2",
          
      },
    },
    immediatelyRender: false,
  })

  const descriptionEditor = useEditor({
    extensions: [      
      StarterKit.configure({   
      // Configure an included extension
      heading: {
        levels: [1, 2, 3],
      },
    }),],
    content: '',
    editorProps: {
      attributes: {
        class:
          "rounded-md border min-h-[150px] border-input bg-background focus:ring-offset-2 disabled:cursor-not-allows disabled:opacity-50 p-2",
          
      },
    },
    immediatelyRender: false,
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
      formData.append("category", category)
      formData.append('published', published.toString())
      formData.append('soldOut', soldOut.toString())

      // Append images
      images.forEach((image, index) => {
        formData.append(`image${index + 1}`, image)
      })

      // Create the product with all data including images
      const createResponse = await fetch('/api/admin/products', {
        method: 'POST',
        body: formData,
      })

      if (!createResponse.ok) {
        throw new Error('Failed to create product')
      }

      router.push('/admin')
    } catch (error) {
      console.error('Error creating product:', error)
      alert('Failed to create product. Please try again.')
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
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
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
      <button 
        type="submit" 
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Creating Product...' : 'Create Product'}
      </button>
    </form>
  )
}



