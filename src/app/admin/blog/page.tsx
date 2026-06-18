import Link from "next/link";

export default function AdminBlogPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Link href="/admin" className="text-sm text-blue-600 hover:underline mb-4 inline-block">&larr; Admin Paneli</Link>
      <h1 className="text-2xl font-bold mb-4">Blog Yönetimi</h1>
      <p className="text-gray-500">Blog sayfası henüz yapım aşamasındadır.</p>
    </div>
  );
}
