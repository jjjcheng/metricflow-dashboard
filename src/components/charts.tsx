"use client";
import { useState, useId } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { money } from "@/lib/utils";
import { ranges, revenueSeries, type Range } from "@/lib/data";
function smooth(points: number[][]) {
  return points.reduce((d, p, i) => {
    if (!i) return `M ${p[0]} ${p[1]}`;
    const prev = points[i - 1];
    const mid = (prev[0] + p[0]) / 2;
    return `${d} C ${mid} ${prev[1]}, ${mid} ${p[1]}, ${p[0]} ${p[1]}`;
  }, "");
}
export function RevenueChart({ range }: { range: Range }) {
  const [active, setActive] = useState<number | null>(null);
  const [metric, setMetric] = useState("Revenue");
  const id = useId().replaceAll(":", "");
  const series = revenueSeries(range);
  const r = ranges[range];
  const isRevenue = metric === "Revenue";
  const values = series.map((s) =>
    isRevenue ? s.revenue : Math.round(s.revenue / 28),
  );
  const max =
    Math.ceil(Math.max(...values) / (isRevenue ? 1000 : 20)) *
    (isRevenue ? 1000 : 20);
  const points = values.map((v, i) => [
    52 + (i * 596) / (values.length - 1),
    204 - (v / max) * 170,
  ]);
  const previous = points.map((p, i) => [
    p[0],
    204 - ((values[i] * r.previous) / r.revenue / max) * 170,
  ]);
  const path = smooth(points);
  return (
    <section className="card revenue-card">
      <div className="card-header">
        <div>
          <h2>Revenue overview</h2>
          <p>A little perspective on your business growth.</p>
        </div>
        <label className="mini-select">
          <select
            aria-label="Chart metric"
            value={metric}
            onChange={(e) => setMetric(e.target.value)}
          >
            <option>Revenue</option>
            <option>Subscriptions</option>
          </select>
          <ChevronDown size={13} />
        </label>
      </div>
      <div className="chart-summary">
        <strong>
          {isRevenue
            ? money(r.revenue)
            : values.reduce((a, b) => a + b, 0).toLocaleString()}
        </strong>
        <span className="trend-pill">
          <ArrowUpRight size={13} />
          {((r.revenue / r.previous - 1) * 100).toFixed(1)}%
        </span>
        <span className="chart-summary-caption">
          {isRevenue ? "total revenue" : "new subscriptions"}
        </span>
        <div className="chart-legend">
          <span>
            <i />
            Current period
          </span>
          <span>
            <i />
            Previous period
          </span>
        </div>
      </div>
      <div className="revenue-plot">
        <svg
          viewBox="0 0 680 244"
          role="img"
          aria-label={`${metric} chart for ${r.label}. ${isRevenue ? money(r.revenue) : values.reduce((a, b) => a + b, 0)} total. Previous period is a modeled comparison.`}
        >
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b67ec" stopOpacity=".20" />
              <stop offset="100%" stopColor="#8b67ec" stopOpacity=".005" />
            </linearGradient>
          </defs>
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
              <line
                x1="52"
                x2="648"
                y1={34 + i * 42.5}
                y2={34 + i * 42.5}
                stroke="var(--border)"
                strokeDasharray="3 4"
              />
              <text x="0" y={38 + i * 42.5} fill="var(--muted)" fontSize="10">
                {isRevenue ? "$" : ""}
                {((max * (4 - i)) / 4).toLocaleString()}
              </text>
            </g>
          ))}
          <path d={`${path} L 648 204 L 52 204 Z`} fill={`url(#${id})`} />
          <path
            d={smooth(previous)}
            stroke="var(--comparison)"
            strokeWidth="2"
            fill="none"
            strokeDasharray="5 5"
          />
          <path
            d={path}
            stroke="#8b62ed"
            strokeWidth="2.8"
            fill="none"
            strokeLinecap="round"
          />
          {[0, 1, 2, 3, 4, 5, 6].map((v) => {
            const i = Math.round((v * (series.length - 1)) / 6);
            return (
              <text
                key={v}
                x={52 + (v * 596) / 6}
                y="231"
                textAnchor={v === 0 ? "start" : v === 6 ? "end" : "middle"}
                fill="var(--muted)"
                fontSize="10"
              >
                {range === "90d"
                  ? [
                      "Mar 1",
                      "Mar 16",
                      "Apr 1",
                      "Apr 16",
                      "May 1",
                      "May 16",
                      "May 31",
                    ][v]
                  : series[i].label}
              </text>
            );
          })}
          {points.map((p, i) => (
            <g
              key={i}
              tabIndex={0}
              role="button"
              aria-label={`${series[i].label}: ${isRevenue ? money(values[i]) : values[i]}`}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              onClick={() => setActive(i)}
            >
              <rect
                x={p[0] - 9}
                y="25"
                width="18"
                height="184"
                fill="transparent"
              />
              <circle
                cx={p[0]}
                cy={p[1]}
                r={active === i ? 5 : 0}
                fill="#8b62ed"
                stroke="var(--card)"
                strokeWidth="3"
              />
            </g>
          ))}
          {active !== null && (
            <g pointerEvents="none">
              <line
                x1={points[active][0]}
                x2={points[active][0]}
                y1="27"
                y2="204"
                stroke="#9b7deb"
                strokeDasharray="3 4"
              />
              <rect
                x={Math.min(542, Math.max(54, points[active][0] - 50))}
                y="7"
                width="108"
                height="42"
                rx="7"
                fill="var(--tooltip)"
              />
              <text
                x={Math.min(596, Math.max(108, points[active][0] + 4))}
                y="23"
                textAnchor="middle"
                fill="white"
                fontSize="9"
              >
                {series[active].label}
              </text>
              <text
                x={Math.min(596, Math.max(108, points[active][0] + 4))}
                y="39"
                textAnchor="middle"
                fill="white"
                fontWeight="600"
                fontSize="12"
              >
                {isRevenue ? money(values[active]) : values[active]}
              </text>
            </g>
          )}
        </svg>
      </div>
      <div className="chart-footnote">
        <span className="status-dot" /> {r.short}{" "}
        <span>Compared to the previous period</span>
      </div>
    </section>
  );
}
export function PlanChart({ range }: { range: Range }) {
  const [selected, setSelected] = useState<string | null>(null);
  const total = ranges[range].revenue;
  const plans = [
    {
      name: "Business",
      share: 48,
      color: "#8054df",
      count: Math.round(total * 0.48),
    },
    {
      name: "Pro",
      share: 34,
      color: "#b598ee",
      count: Math.round(total * 0.34),
    },
    {
      name: "Starter",
      share: 18,
      color: "#e5d9fb",
      count: total - Math.round(total * 0.48) - Math.round(total * 0.34),
    },
  ];
  let offset = 0;
  return (
    <section className="card plan-card">
      <div className="card-header">
        <div>
          <h2>Revenue by plan</h2>
          <p>Every plan, part of the bigger picture.</p>
        </div>
        <span className="subtle-icon">↗</span>
      </div>
      <div className="donut-wrap">
        <svg
          viewBox="0 0 220 200"
          role="img"
          aria-label="Revenue by plan: Business 48%, Pro 34%, Starter 18%"
        >
          <circle
            cx="110"
            cy="103"
            r="70"
            fill="none"
            stroke="var(--surface)"
            strokeWidth="22"
          />
          {plans.map((p) => {
            const start = offset;
            offset += p.share;
            return (
              <circle
                key={p.name}
                cx="110"
                cy="103"
                r="70"
                pathLength="100"
                fill="none"
                stroke={p.color}
                strokeWidth={selected === p.name ? 27 : 22}
                strokeDasharray={`${p.share - 1.5} ${101.5 - p.share}`}
                strokeDashoffset={-start}
                transform="rotate(-90 110 103)"
                style={{ transition: "stroke-width .2s" }}
              />
            );
          })}
          <text
            x="110"
            y="96"
            textAnchor="middle"
            fill="var(--muted)"
            fontSize="11"
          >
            {selected || "Total revenue"}
          </text>
          <text
            x="110"
            y="123"
            textAnchor="middle"
            fill="var(--text)"
            fontSize="24"
            fontWeight="650"
            letterSpacing="-1"
          >
            {money(
              selected ? plans.find((p) => p.name === selected)!.count : total,
            )}
          </text>
        </svg>
      </div>
      <div className="plan-legend">
        {plans.map((p) => (
          <button
            key={p.name}
            onMouseEnter={() => setSelected(p.name)}
            onMouseLeave={() => setSelected(null)}
            onFocus={() => setSelected(p.name)}
            onBlur={() => setSelected(null)}
            onClick={() => setSelected(selected === p.name ? null : p.name)}
          >
            <span>
              <i style={{ background: p.color }} />
              {p.name}
              <small>{p.share}%</small>
            </span>
            <strong>{money(p.count)}</strong>
          </button>
        ))}
      </div>
    </section>
  );
}
