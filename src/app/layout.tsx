import type { Metadata } from "next";

import "./globals.css";

import Icons from "@/components/HeadIcons"
import Image from "next/image";
import Link from "next/link"




export const metadata: Metadata = {
  title: "Mem's Handmade",
  description: "Generated by MeM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="font-raleway"
      >
            <header className="w-full py-6 bg-background">
      <div className="container flex flex-col items-center justify-center gap-6 max-w-full">
      <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold" prefetch={false}>
        
        <Image
          src="/memshandmade-com-logo.png" 
 
          alt="Memshandmade.com logo"
          width={400}
          height={76}
          className="object-cover w-full "
        />
          
      </Link>
      <Icons />


        
 
      </div>
    </header>
    <hr className="my-2 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400" />
    <div className="my-6 ">{children}
    
      
     </div>
      </body>
    </html>
  );
}
