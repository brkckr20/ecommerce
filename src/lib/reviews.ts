export interface Review {
  id: string;
  productSlug: string;
  author: string;
  email: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
}

export interface ReviewFormData {
  author: string;
  email: string;
  rating: number;
  title: string;
  body: string;
}

export interface ReviewStats {
  rating: number;
  count: number;
}

export async function fetchReviews(productSlug: string): Promise<Review[]> {
  const res = await fetch(`/api/reviews?slug=${encodeURIComponent(productSlug)}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.reviews;
}

export async function fetchReviewStats(productSlug: string): Promise<ReviewStats> {
  const res = await fetch(`/api/reviews?slug=${encodeURIComponent(productSlug)}&stats=true`);
  if (!res.ok) return { rating: 0, count: 0 };
  const data = await res.json();
  return data;
}

export async function submitReview(
  productSlug: string,
  data: ReviewFormData
): Promise<Review> {
  const res = await fetch(`/api/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productSlug, ...data }),
  });
  if (!res.ok) throw new Error("Yorum gönderilemedi.");
  const result = await res.json();
  return result.review;
}
