import { cookies } from 'next/headers'
import AdminLogin from '@/components/AdminLogin'
import NewProductForm from '@/components/NewProductForm'
import Link from 'next/link'

export default async function NewProductPage() {
  const cookieStore = await cookies()
  const isLoggedIn = cookieStore.get('admin_logged_in')?.value === 'true'

  if (!isLoggedIn) {
    return <AdminLogin />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Create New Product</h1>
        <Link href="/admin" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
          Back to Dashboard
        </Link>
      </div>
      <NewProductForm />
    </div>
  )
}

