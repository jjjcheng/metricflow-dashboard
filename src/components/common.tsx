"use client";
import {
  CalendarDays,
  ChevronDown,
  Download,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Button } from "./ui/button";
import { ranges, type Range } from "@/lib/data";
export function PageHeading({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <div className="heading-actions">{children}</div>
    </div>
  );
}
export function DateRange({
  value,
  onChange,
}: {
  value: Range;
  onChange: (v: Range) => void;
}) {
  return (
    <label className="date-range">
      <CalendarDays size={16} />
      <select
        aria-label="Reporting period"
        value={value}
        onChange={(e) => onChange(e.target.value as Range)}
      >
        {Object.entries(ranges).map(([key, r]) => (
          <option key={key} value={key}>
            {r.label}
          </option>
        ))}
      </select>
      <ChevronDown size={14} />
    </label>
  );
}
export function ExportButton({
  onClick,
  label = "Export report",
}: {
  onClick: () => void;
  label?: string;
}) {
  return (
    <Button variant="outline" onClick={onClick}>
      <Download size={15} />
      {label}
    </Button>
  );
}
export function Badge({ status }: { status: string }) {
  return (
    <span className={`badge ${status.toLowerCase()}`}>
      <i />
      {status}
    </span>
  );
}
export function StatCard({
  label,
  value,
  change,
  note,
  icon: Icon,
  points,
  down = false,
}: {
  label: string;
  value: string;
  change: string;
  note?: string;
  icon: React.ElementType;
  points: number[];
  down?: boolean;
}) {
  return (
    <article className="stat-card">
      <div className="stat-label">
        {label}
        <span>
          <Icon size={17} />
        </span>
      </div>
      <div className="stat-main">
        <strong>{value}</strong>
        <svg
          className={`sparkline ${down ? "spark-green" : ""}`}
          viewBox="0 0 110 42"
          aria-hidden="true"
        >
          <path
            d={`M ${points.map((p, i) => `${(i * 110) / (points.length - 1)},${42 - p}`).join(" L ")}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="stat-comparison">
        <span className="positive">
          {down ? <ArrowDownRight size={13} /> : <ArrowUpRight size={13} />}{" "}
          {change}
        </span>
        <span>{note || "vs. previous period"}</span>
      </div>
    </article>
  );
}
export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="empty-state compact">
      <span className="empty-symbol">⌕</span>
      <strong>{title}</strong>
      <p>{description}</p>
    </div>
  );
}
