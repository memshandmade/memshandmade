import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import EditProductForm from '@/components/EditProductForm'
import { cookies } from 'next/headers'
import AdminLogin from '@/components/AdminLogin'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage(props: PageProps) {
  const params = await props.params;
  const cookieStore = await cookies()
  const isLoggedIn = cookieStore.get('admin_logged_in')?.value === 'true'

  if (!isLoggedIn) {
    return <AdminLogin />
  }

  const productId = parseInt(params.id)

  if (isNaN(productId)) {
    return notFound()
  }

  const product = await prisma.product.findUnique({
    where: { id: productId }
  })

  if (!product) {
    return notFound()
  }

  // Serialize the product data
  const serializedProduct = JSON.parse(JSON.stringify(product))

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Product</h1>
      <EditProductForm product={serializedProduct} />
    </div>
  )
}

