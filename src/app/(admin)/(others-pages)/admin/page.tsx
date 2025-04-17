import AdminUsers from '@/components/pages/admin/admin-users/admin-user'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'

export default function Home() {
  return (
    <main>
      <PageBreadcrumb pageTitle="Admin huquqlari" />
      <AdminUsers />
    </main>
  )
}
