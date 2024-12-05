'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from 'next/image'

export default function AdminForm() {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const router = useRouter()

  const introEditor = useEditor({
    extensions: [StarterKit],
    content: '',
  })

  const descriptionEditor = useEditor({
    extensions: [StarterKit],
    content: '',
  })

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
    images.forEach((image, index) => {
      formData.append(`image${index + 1}`, image)
    })

    const response = await fetch('/api/products', {
      method: 'POST',
      body: formData,
    })

    if (response.ok) {
      setName('')
      setPrice('')
      setImages([])
      setImagePreviews([])
      introEditor?.commands.setContent('')
      descriptionEditor?.commands.setContent('')
      router.refresh()
    } else {
      console.error('Failed to create product')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <div>
        <label className="block mb-2">Intro</label>
        <EditorContent editor={introEditor} className="border rounded p-2" />
      </div>
      <div>
        <label className="block mb-2">Description</label>
        <EditorContent editor={descriptionEditor} className="border rounded p-2" />
      </div>
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="w-full p-2 border rounded"
        required
        step="0.01"
      />
      <div>
        <label className="block mb-2">Images (up to 5)</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="w-full p-2 border rounded"
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
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Add Product
      </button>
    </form>
  )
}

