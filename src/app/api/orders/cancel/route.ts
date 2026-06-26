import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { orderId, type, reason, email, items } = body;

  if (!orderId || !type || !reason) {
    return NextResponse.json({ error: "Eksik bilgi" }, { status: 400 });
  }

  if (type !== "cancel" && type !== "return") {
    return NextResponse.json({ error: "Geçersiz işlem türü" }, { status: 400 });
  }

  if (type === "return") {
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "İade edilecek ürün seçilmedi." }, { status: 400 });
    }
  }

  await new Promise((r) => setTimeout(r, 500));

  const isPartial = type === "return" && items.length < (body.totalItems || items.length + 1);

  return NextResponse.json({
    success: true,
    message:
      type === "cancel"
        ? "İptal talebiniz alındı. 2 saat içinde tarafınıza bilgilendirme e-postası gönderilecektir."
        : isPartial
          ? "Kısmı iade talebiniz alındı. 3 iş günü içinde tarafınıza dönüş yapılacaktır."
          : "İade talebiniz alındı. 3 iş günü içinde tarafınıza dönüş yapılacaktır.",
    requestId: `REQ-${Date.now()}`,
  });
}
