"use client"


import Link from "next/link"
import { JSX, SVGProps } from "react"
import { FloatingWhatsApp } from 'react-floating-whatsapp'


export default function Icons() {
  return (
    <div className="w-full bg-gray-100 py-4 dark:bg-gray-950">
      <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-4 md:flex-row md:gap-0">
 
        <div className="flex items-center gap-4">
          <Link
            href="https://www.facebook.com/memshandmade"
            className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            prefetch={false}
          >
            <FacebookIcon className="h-6 w-6" />
            <span className="sr-only">Facebook</span>
          </Link>
          <Link
            href="https://www.instagram.com/memshandmade"
            className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            prefetch={false}
          >
            <InstagramIcon className="h-6 w-6" />
            <span className="sr-only">Instagram</span>
          </Link>
          <FloatingWhatsApp
        phoneNumber='+66812731313' // Required
        accountName='Mem Moss' // Optional
        avatar='/mem.webp' // Optional
        
        statusMessage='Available' // Optional
        placeholder='Send me a message...' // Optional
        allowEsc={true} // Optional
        className='relative'
        
      />
        </div>
      </div>
    </div>
  )
}




function FacebookIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}


function InstagramIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}


