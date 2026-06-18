"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import StarRating from "./StarRating";
import { submitReview, fetchReviewStats } from "@/lib/reviews";
import { useCustomer } from "@/providers/ShopifyCustomerProvider";
import type { Review, ReviewFormData } from "@/lib/reviews";

interface Props {
  productSlug: string;
  variantIds?: string[];
  onStatsUpdate?: (rating: number, count: number) => void;
}

export default function ProductReviews({ productSlug, variantIds = [], onStatsUpdate }: Props) {
  const { customer } = useCustomer();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState({ rating: 0, count: 0 });
  const [showDemo, setShowDemo] = useState(false);
  const [loading, setLoading] = useState(true);

  const canReview = !!(customer && variantIds.length > 0 && customer.orders?.edges?.some((e: any) =>
    e.node.lineItems?.edges?.some((li: any) =>
      variantIds.includes(li.node.variant?.id)
    )
  ));

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<ReviewFormData>({
    author: "",
    email: "",
    rating: 5,
    title: "",
    body: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/reviews?slug=${encodeURIComponent(productSlug)}`);
      const data = await res.json();
      setReviews(data.reviews || []);
      setShowDemo(data.showDemo || false);
      const sRes = await fetch(`/api/reviews?slug=${encodeURIComponent(productSlug)}&stats=true`);
      const sData = await sRes.json();
      setStats(sData);
      onStatsUpdate?.(sData.rating, sData.count);
      setLoading(false);
    }
    load();
  }, [productSlug, onStatsUpdate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    try {
      const newReview = await submitReview(productSlug, form);
      setReviews((prev) => [newReview, ...prev]);
      const updated = await fetchReviewStats(productSlug);
      setStats(updated);
      onStatsUpdate?.(updated.rating, updated.count);
      setSubmitSuccess(true);
      setForm({ author: "", email: "", rating: 5, title: "", body: "" });
      setTimeout(() => {
        setShowForm(false);
        setSubmitSuccess(false);
      }, 2000);
    } catch {
      setSubmitError("Yorum gönderilirken bir hata oluştu.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-text">Yorumlar yükleniyor...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-heading">{stats.rating}</span>
          <div>
            <StarRating rating={stats.rating} size="md" />
            <p className="text-xs text-text mt-0.5">{stats.count} yorum</p>
          </div>
        </div>
        {canReview ? (
          <button
            onClick={() => {
              setShowForm(!showForm);
              setSubmitSuccess(false);
              setSubmitError("");
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors"
          >
            {showForm ? "Vazgeç" : "Yorum Yap"}
          </button>
        ) : (
          <p className="text-xs text-text">
            {customer
              ? "Yorum yapabilmek için bu ürünü satın almalısınız."
              : <Link href="/login" className="text-primary hover:underline">Yorum yapmak için giriş yapın.</Link>
            }
          </p>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-background-grey rounded-lg p-6 mb-6 space-y-4">
          <h3 className="text-base font-semibold text-heading">Yorum Ekle</h3>

          <div className="flex items-center gap-2">
            <span className="text-sm text-text">Puanın:</span>
            <StarRating
              rating={form.rating}
              size="lg"
              interactive
              onChange={(val) => setForm({ ...form, rating: val })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-text font-medium mb-1">Adın Soyadın *</label>
              <input
                type="text"
                required
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="Adın Soyadın"
              />
            </div>
            <div>
              <label className="block text-xs text-text font-medium mb-1">E-posta *</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="ornek@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-text font-medium mb-1">Başlık (isteğe bağlı)</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="Yorumunuz için kısa bir başlık"
            />
          </div>

          <div>
            <label className="block text-xs text-text font-medium mb-1">Yorumun *</label>
            <textarea
              required
              rows={4}
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
              placeholder="Ürün hakkındaki düşüncelerinizi paylaşın..."
            />
          </div>

          {submitError && (
            <p className="text-sm text-red-500">{submitError}</p>
          )}

          {submitSuccess && (
            <p className="text-sm text-green-600">Yorumunuz başarıyla eklendi! Teşekkür ederiz.</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Gönderiliyor..." : "Yorumu Gönder"}
          </button>
        </form>
      )}

      {reviews.length === 0 && !showDemo ? (
        <div className="text-center py-8 border-t border-border">
          <p className="text-sm text-text">Bu ürüne henüz yorum yapılmamış. İlk yorumu sen yap!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {showDemo && (
            <p className="text-xs text-text-lighter italic mb-2">* Örnek yorumlar gösteriliyor</p>
          )}
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-border pb-4 last:border-b-0 last:pb-0">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <StarRating rating={review.rating} size="sm" />
                  {review.title && (
                    <span className="text-sm font-semibold text-heading">{review.title}</span>
                  )}
                </div>
                <span className="text-xs text-text-lighter">
                  {new Date(review.createdAt).toLocaleDateString("tr-TR")}
                </span>
              </div>
              <p className="text-xs text-text mb-1">
                <span className="font-medium text-heading">{review.author}</span>
              </p>
              <p className="text-sm text-text leading-relaxed">{review.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
