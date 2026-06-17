import { NextRequest, NextResponse } from "next/server";
import type { Review } from "@/lib/reviews";

const demoReviews: Review[] = [
  {
    id: "demo-1",
    productSlug: "*",
    author: "Ayşe Yılmaz",
    email: "ayse@example.com",
    rating: 5,
    title: "Harika kalite",
    body: "Pamuklu yapısı çok yumuşak, bebeğimin hassas cildine hiçbir zarar vermedi. Kesinlikle tavsiye ederim.",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "demo-2",
    productSlug: "*",
    author: "Mehmet Demir",
    email: "mehmet@example.com",
    rating: 4,
    title: "Güzel ürün, bedene dikkat",
    body: "Kaliteli ve şık. Biraz büyük geldi, bir beden küçük alsaydım daha iyi olurmuş.",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "demo-3",
    productSlug: "*",
    author: "Zeynep Kara",
    email: "zeynep@example.com",
    rating: 5,
    title: "Renkler harika",
    body: "İnternetteki resimlerle birebir aynı renkler. Yıkama sonrası çekme yapmadı, çok memnun kaldım.",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

let userReviews: Review[] = [];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const statsOnly = searchParams.get("stats") === "true";

  if (!slug) {
    return NextResponse.json({ error: "slug gerekli" }, { status: 400 });
  }

  const realReviews = userReviews.filter((r) => r.productSlug === slug);
  const showDemo = realReviews.length === 0;
  const mappedDemo = demoReviews.map((r) => ({ ...r, productSlug: slug }));
  const all = showDemo ? mappedDemo : [...mappedDemo, ...realReviews];

  if (statsOnly) {
    if (all.length === 0) {
      return NextResponse.json({ rating: 0, count: 0 });
    }
    const total = all.reduce((sum, r) => sum + r.rating, 0);
    const rating = Math.round((total / all.length) * 10) / 10;
    return NextResponse.json({ rating, count: all.length });
  }

  const sorted = all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return NextResponse.json({ reviews: sorted, showDemo });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productSlug, author, email, rating, title, body: reviewBody } = body;

    if (!productSlug || !author || !email || !rating || !reviewBody) {
      return NextResponse.json({ error: "Tüm alanlar gerekli" }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Puan 1-5 arası olmalı" }, { status: 400 });
    }

    const review: Review = {
      id: `review-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      productSlug,
      author,
      email,
      rating,
      title: title || "",
      body: reviewBody,
      createdAt: new Date().toISOString(),
    };

    userReviews.push(review);
    return NextResponse.json({ review }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }
}
