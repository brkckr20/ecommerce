"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface ImageGalleryProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export default function ImageGallery({ images, onChange }: ImageGalleryProps) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList) {
    setUploading(true);
    const urls: string[] = [];

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (data.url) urls.push(data.url);
      } catch {}
    }

    if (urls.length > 0) {
      onChange([...images, ...urls]);
    }
    setUploading(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files);
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) handleFiles(e.target.files);
  }

  function handleDragStart(index: number) {
    setDragIndex(index);
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    const reordered = [...images];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(index, 0, moved);
    onChange(reordered);
    setDragIndex(index);
  }

  function handleDragEnd() {
    setDragIndex(null);
  }

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-[#666666]">Ürün Görselleri</label>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
          dragging ? "border-primary bg-primary/5" : "border-[#EEEEEE] hover:border-primary/50"
        }`}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span className="text-xs text-[#ABABAB]">Yükleniyor...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <svg className="h-8 w-8 text-[#ABABAB]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <span className="text-xs text-[#ABABAB]">Görsel eklemek için sürükle bırak veya tıkla</span>
            <span className="text-[10px] text-[#ABABAB]">İlk görsel ana görsel olarak kullanılır</span>
          </div>
        )}
        <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleInput} className="hidden" />
      </div>

      {images.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-3">
          {images.map((url, index) => (
            <div
              key={url}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`relative cursor-grab rounded-lg border-2 transition-all ${
                dragIndex === index ? "border-primary opacity-50" : "border-[#EEEEEE]"
              } ${index === 0 ? "ring-2 ring-primary" : ""}`}
            >
              <Image src={url} alt="" width={80} height={80} className="h-20 w-20 rounded-lg object-cover" />
              {index === 0 && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded bg-primary px-1.5 py-0.5 text-[9px] font-medium text-white whitespace-nowrap">
                  Ana Görsel
                </span>
              )}
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white shadow"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
