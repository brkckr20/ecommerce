import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-6">Admin Paneli</h1>
      <nav className="space-y-2">
        <Link href="/admin/blog" className="block text-blue-600 hover:underline">Blog Yönetimi</Link>
      </nav>
    </div>
  );
}
