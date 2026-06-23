"use client";

import { useState } from "react";

interface VariantStock {
  [key: string]: number;
}

interface Props {
  colors: string[];
  sizes: string[];
  stocks: VariantStock;
  onColorsChange: (colors: string[]) => void;
  onSizesChange: (sizes: string[]) => void;
  onStockChange: (key: string, value: number) => void;
}

export default function VariantMatrix({ colors, sizes, stocks, onColorsChange, onSizesChange, onStockChange }: Props) {
  const [colorInput, setColorInput] = useState(colors.join("\n"));
  const [sizeInput, setSizeInput] = useState(sizes.join("\n"));

  const parsedColors = colorInput.split("\n").map((s) => s.trim()).filter(Boolean);
  const parsedSizes = sizeInput.split("\n").map((s) => s.trim()).filter(Boolean);

  function cellKey(color: string, size: string) {
    return `stock_${color}_${size}`.replace(/[^a-zA-Z0-9_]/g, "_");
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-[#666666]">
            Renk Kodları <span className="text-[#ABABAB]">(her satıra bir hex kod)</span>
          </label>
          <textarea
            value={colorInput}
            onChange={(e) => { setColorInput(e.target.value); onColorsChange(e.target.value.split("\n").map((s) => s.trim()).filter(Boolean)); }}
            rows={4}
            placeholder="#F5D6D6"
            className="w-full rounded-lg border border-[#EEEEEE] px-3 py-2 text-sm outline-none focus:border-primary"
          />
          {parsedColors.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {parsedColors.map((c) => (
                <span key={c} className="flex items-center gap-1.5 rounded-md border border-[#EEEEEE] px-2 py-1 text-xs text-[#666666]">
                  <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: c }} />
                  {c}
                </span>
              ))}
            </div>
          )}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[#666666]">
            Bedenler <span className="text-[#ABABAB]">(her satıra bir beden)</span>
          </label>
          <textarea
            value={sizeInput}
            onChange={(e) => { setSizeInput(e.target.value); onSizesChange(e.target.value.split("\n").map((s) => s.trim()).filter(Boolean)); }}
            rows={4}
            placeholder="3 Ay"
            className="w-full rounded-lg border border-[#EEEEEE] px-3 py-2 text-sm outline-none focus:border-primary"
          />
          {parsedSizes.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {parsedSizes.map((s) => (
                <span key={s} className="rounded-md border border-[#EEEEEE] px-2 py-1 text-xs text-[#666666]">{s}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {parsedColors.length > 0 && parsedSizes.length > 0 && (
        <div className="mt-5 overflow-x-auto">
          <label className="mb-2 block text-sm font-medium text-[#666666]">Varyant Stokları</label>
          <table className="w-full min-w-[400px] text-sm">
            <thead>
              <tr>
                <th className="border border-[#EEEEEE] bg-[#F8F8F8] px-3 py-2 text-left text-xs font-medium text-[#666666]">Renk \ Beden</th>
                {parsedSizes.map((size) => (
                  <th key={size} className="border border-[#EEEEEE] bg-[#F8F8F8] px-3 py-2 text-center text-xs font-medium text-[#666666]">{size}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {parsedColors.map((color) => (
                <tr key={color}>
                  <td className="border border-[#EEEEEE] px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
                      <span className="text-xs text-[#666666]">{color}</span>
                    </div>
                  </td>
                  {parsedSizes.map((size) => {
                    const key = cellKey(color, size);
                    return (
                      <td key={key} className="border border-[#EEEEEE] px-2 py-1.5">
                        <input
                          type="number"
                          min={0}
                          value={stocks[key] ?? 0}
                          onChange={(e) => onStockChange(key, Number(e.target.value))}
                          className="w-full rounded border border-[#EEEEEE] px-2 py-1 text-center text-xs outline-none focus:border-primary"
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-xs text-[#ABABAB]">
            Toplam: {Object.values(stocks).reduce((s, v) => s + v, 0)} adet
          </p>
        </div>
      )}
    </div>
  );
}
