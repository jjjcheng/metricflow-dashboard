import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const money = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
export function downloadCsv(filename: string, rows: (string | number)[][]) {
  const escape = (value: string | number) => {
    const s = String(value);
    const safe = /^[=+@\-\t\r]/.test(s) ? `'${s}` : s;
    return `"${safe.replaceAll('"', '""')}"`;
  };
  const url = URL.createObjectURL(
    new Blob(
      ["\uFEFF" + rows.map((row) => row.map(escape).join(",")).join("\r\n")],
      { type: "text/csv;charset=utf-8;" },
    ),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
