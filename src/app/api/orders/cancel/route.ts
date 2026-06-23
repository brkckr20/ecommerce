import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { orderId, type, reason, email } = body;

  if (!orderId || !type || !reason) {
    return NextResponse.json({ error: "Eksik bilgi" }, { status: 400 });
  }

  if (type !== "cancel" && type !== "return") {
    return NextResponse.json({ error: "Geçersiz işlem türü" }, { status: 400 });
  }

  await new Promise((r) => setTimeout(r, 500));

  return NextResponse.json({
    success: true,
    message:
      type === "cancel"
        ? "İptal talebiniz alındı. 2 saat içinde tarafınıza bilgilendirme e-postası gönderilecektir."
        : "İade talebiniz alındı. 3 iş günü içinde tarafınıza dönüş yapılacaktır.",
    requestId: `REQ-${Date.now()}`,
  });
}
