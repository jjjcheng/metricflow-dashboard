"use client";
import { useState } from "react";
import {
  ArrowUpRight,
  MousePointer2,
  Target,
  Users,
  Wallet,
} from "lucide-react";
import { PageHeading, DateRange, ExportButton, StatCard } from "./common";
import { RevenueChart } from "./charts";
import { ranges, type Range } from "@/lib/data";
import { downloadCsv } from "@/lib/utils";
import { useWorkspace } from "./providers";
export function Analytics() {
  const [range, setRange] = useState<Range>("30d");
  const { notify } = useWorkspace();
  const factor = range === "7d" ? 0.24 : range === "90d" ? 2.8 : 1;
  const channels = [
    {
      name: "Organic search",
      color: "#8860e5",
      visitors: Math.round(18420 * factor),
      share: 42,
      conversion: "5.8%",
    },
    {
      name: "Direct",
      color: "#ae8dea",
      visitors: Math.round(12720 * factor),
      share: 29,
      conversion: "6.2%",
    },
    {
      name: "Referrals",
      color: "#c9b3f1",
      visitors: Math.round(7890 * factor),
      share: 18,
      conversion: "4.9%",
    },
    {
      name: "Social media",
      color: "#e1d5f5",
      visitors: Math.round(4820 * factor),
      share: 11,
      conversion: "3.2%",
    },
  ];
  const total = channels.reduce((a, c) => a + c.visitors, 0);
  const signup = Math.round(total * 0.124);
  const trial = Math.round(total * 0.081);
  const converted = Math.round(total * 0.053);
  return (
    <div className="page">
      <PageHeading
        eyebrow="TURN NUMBERS INTO YOUR NEXT MOVE"
        title="Analytics"
        description="Understand what’s working. Find your next opportunity."
      >
        <DateRange value={range} onChange={setRange} />
        <ExportButton
          onClick={() => {
            downloadCsv(`metricflow-acquisition-${range}.csv`, [
              ["Period", ranges[range].label],
              ["Channel", "Visitors", "Share", "Conversion rate"],
              ...channels.map((c) => [
                c.name,
                c.visitors,
                `${c.share}%`,
                c.conversion,
              ]),
            ]);
            notify("Acquisition report exported.");
          }}
        />
      </PageHeading>
      <div className="stats-grid">
        <StatCard
          label="Total visitors"
          value={total.toLocaleString()}
          change="18.6%"
          icon={Users}
          points={[8, 15, 12, 20, 16, 28, 25, 37]}
        />
        <StatCard
          label="Sign-up rate"
          value="12.4%"
          change="2.1 pp"
          icon={MousePointer2}
          points={[9, 12, 9, 19, 16, 27, 24, 35]}
        />
        <StatCard
          label="Paid conversion"
          value="5.3%"
          change="0.8 pp"
          icon={Target}
          points={[8, 12, 17, 14, 26, 22, 31, 36]}
        />
        <StatCard
          label="Customer lifetime value"
          value="$486"
          change="9.2%"
          icon={Wallet}
          points={[7, 14, 11, 23, 20, 28, 25, 37]}
        />
      </div>
      <div className="analytics-grid">
        <RevenueChart key={range} range={range} />
        <section className="card funnel-card">
          <div className="card-header">
            <div>
              <h2>Conversion funnel</h2>
              <p>From first visit to first payment.</p>
            </div>
            <Target size={18} className="muted" />
          </div>
          <div className="funnel">
            {[
              { name: "Visitors", value: total, percent: 100 },
              { name: "Sign-ups", value: signup, percent: 12.4 },
              { name: "Started trial", value: trial, percent: 8.1 },
              { name: "Paid customers", value: converted, percent: 5.3 },
            ].map((s, i) => (
              <div key={s.name} className="funnel-step">
                <div>
                  <span>
                    <small>0{i + 1}</small>
                    {s.name}
                  </span>
                  <strong>{s.value.toLocaleString()}</strong>
                </div>
                <div className="funnel-track">
                  <span
                    style={{ width: `${100 - i * 21}%`, opacity: 1 - i * 0.15 }}
                  />
                </div>
                <small>{s.percent}% of visitors</small>
              </div>
            ))}
          </div>
          <div className="funnel-note">
            <ArrowUpRight size={17} />
            <span>
              Paid conversion is up <strong>0.8 percentage points</strong> this
              period.
            </span>
          </div>
        </section>
      </div>
      <section className="card">
        <div className="card-header">
          <div>
            <h2>Where your customers find you</h2>
            <p>A closer look at your acquisition channels.</p>
          </div>
          <span className="tag">{ranges[range].short}</span>
        </div>
        <div className="table-scroll">
          <table className="channel-table">
            <thead>
              <tr>
                <th>Channel</th>
                <th>Visitors</th>
                <th>Traffic share</th>
                <th>Conversion rate</th>
                <th>Trend</th>
              </tr>
            </thead>
            <tbody>
              {channels.map((c, i) => (
                <tr key={c.name}>
                  <td>
                    <span className="channel-name">
                      <i style={{ background: c.color }} />
                      {c.name}
                    </span>
                  </td>
                  <td>{c.visitors.toLocaleString()}</td>
                  <td>
                    <div className="traffic-share">
                      <div>
                        <span
                          style={{
                            width: `${c.share * 2}%`,
                            background: c.color,
                          }}
                        />
                      </div>
                      {c.share}%
                    </div>
                  </td>
                  <td>{c.conversion}</td>
                  <td className="positive">
                    <ArrowUpRight size={14} /> {[16.2, 12.4, 8.7, 6.1][i]}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <p className="data-note">
        Fictional reporting snapshot · Acquisition data and comparison trends
        are modeled for this portfolio demo.
      </p>
    </div>
  );
}
