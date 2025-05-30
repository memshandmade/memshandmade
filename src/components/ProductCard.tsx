"use client"

import Image from 'next/image'

import { useState } from "react"
import { Prisma } from '@prisma/client'
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"


interface Product {
  id: number
  name: string
  intro: string
  description: string
  price: Prisma.Decimal
  soldOut: boolean
  published: boolean
  image1: string 
  image2: string 
  image3: string 
  image4: string 
  image5: string 
}

export default function SingleProduct({ product }: { product: Product }) {

  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  return (
    <Card className="w-full max-w-3xl mx-auto flex flex-col h-full">
        
      <Image
        src={product.image1}
        alt="Product main image"
        width={800}
        height={400}
        className="w-full h-[400px] object-cover"
      />
      <CardContent className="p-6">
        <h2 className="text-2xl font-bold mb-4">Product Name</h2>
        <p className="text-gray-600 mb-6">
            <div dangerouslySetInnerHTML={{ __html:product.intro }} />
            <div dangerouslySetInnerHTML={{ __html:product.description }} />
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          
            
            <Image
              
              src={product.image2}
              alt="Product image 2"
              width={200}
              height={200}
              className="w-full h-auto object-cover cursor-pointer"
              onClick={() => setSelectedImage(product.image2)}
            />
            <Image
              
              src={product.image3}
              alt="Product image 3"
              width={200}
              height={200}
              className="w-full h-auto object-cover cursor-pointer"
              onClick={() => setSelectedImage(product.image3)}
            />
          
        </div>
      </CardContent>
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0">
          {selectedImage && (
            <Image
              src={selectedImage}
              alt="Full screen product image"
              width={1200}
              height={800}
              className="w-full h-full object-contain"
            />
          )}
        </DialogContent>
       
      </Dialog>

    </Card>
  )
}
