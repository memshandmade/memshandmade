"use client"

import React, { useState } from 'react';
import Image from 'next/image';

interface NewProductFormProps {
  // This interface is intentionally left empty as the component doesn't require any props
}

const MAX_FILE_SIZE = 500 * 1024; // 500KB

export default function NewProductForm({}: NewProductFormProps) {
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages: File[] = [];
    const newPreviews: string[] = [];

    for (const file of files) {
      try {
        const compressedBlob = await compressImage(file);
        const compressedFile = new File([compressedBlob], file.name, { type: file.type });
        newImages.push(compressedFile);
        newPreviews.push(URL.createObjectURL(compressedFile));
      } catch (error) {
        console.error('Error compressing image:', error);
      }
    }

    setImages((prevImages) => [...prevImages, ...newImages].slice(0, 5));
    setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews].slice(0, 5));
  };

  async function compressImage(file: File): Promise<Blob> {
    const imageBitmap = await createImageBitmap(file);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    const scaleFactor = Math.sqrt(MAX_FILE_SIZE / file.size);
    canvas.width = imageBitmap.width * scaleFactor;
    canvas.height = imageBitmap.height * scaleFactor;

    ctx.drawImage(imageBitmap, 0, 0, canvas.width, canvas.height);

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Canvas to Blob conversion failed'));
          }
        },
        file.type,
        0.7
      );
    });
  }

  return (
    <form>
      <input type="file" multiple onChange={handleImageChange} />
      <div>
        {imagePreviews.map((preview, index) => (
          <div key={preview}>
            <Image
              src={preview}
              alt={`Preview ${index + 1}`}
              width={100}
              height={100}
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </form>
  );
}

