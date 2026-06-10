import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "Dosya bulunamadı." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(file.name) || ".png";
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    const dir = path.join(process.cwd(), "public/uploads/products");
    const filePath = path.join(dir, fileName);

    await mkdir(dir, { recursive: true });
    await writeFile(filePath, buffer);

    return NextResponse.json({
      url: `/uploads/products/${fileName}`,
      name: file.name,
    });
  } catch (error) {
    return NextResponse.json({ error: "Yükleme başarısız." }, { status: 500 });
  }
}
