import { cookies } from 'next/headers'
import AdminLogin from '@/components/AdminLogin'
import AdminDashboard from '@/components/AdminDashboard'

export default async function AdminPage() {
  const cookieStore = await cookies()
  const isLoggedIn = cookieStore.get('admin_logged_in')?.value === 'true'

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
      {isLoggedIn ? <AdminDashboard /> : <AdminLogin />}
    </div>
  )
}

