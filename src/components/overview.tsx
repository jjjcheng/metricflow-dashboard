"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  Plus,
  Sparkles,
  Users,
  UserPlus,
  TrendingUp,
} from "lucide-react";
import {
  PageHeading,
  DateRange,
  ExportButton,
  StatCard,
  Badge,
} from "./common";
import { RevenueChart, PlanChart } from "./charts";
import { useWorkspace } from "./providers";
import { Avatar } from "./shell";
import { money, downloadCsv } from "@/lib/utils";
import { ranges, revenueSeries, prices, type Range } from "@/lib/data";
export function Overview() {
  const [range, setRange] = useState<Range>("30d");
  const { customers, settings, notify } = useWorkspace();
  const r = ranges[range];
  const trend = ((r.revenue / r.previous - 1) * 100).toFixed(1);
  const exportReport = () => {
    downloadCsv(`metricflow-revenue-${range}.csv`, [
      ["Period", "Revenue (USD)"],
      ...revenueSeries(range).map((s) => [s.label, s.revenue]),
      ["Total", r.revenue],
    ]);
    notify("Revenue report exported.");
  };
  return (
    <div className="page">
      <PageHeading
        eyebrow="YOUR BUSINESS, AT A GLANCE"
        title={`Welcome back, ${settings.name.split(" ")[0]} 👋`}
        description="Here’s what’s happening with your business this period."
      >
        <DateRange value={range} onChange={setRange} />
        <ExportButton onClick={exportReport} />
      </PageHeading>
      <div className="overview-context">
        <div className="page-tabs">
          <span className="selected">Overview</span>
          <Link href="/analytics">
            Detailed analytics <ArrowUpRight size={13} />
          </Link>
        </div>
        <span className="live-label">
          <span className="status-dot" /> Updated May 31, 2026
        </span>
      </div>
      <div className="stats-grid">
        <StatCard
          label="Total revenue"
          value={money(r.revenue)}
          change={`${trend}%`}
          icon={DollarSign}
          points={[8, 11, 9, 18, 14, 19, 16, 28, 24, 29, 26, 36]}
        />
        <StatCard
          label="Active subscribers"
          value={r.customers.toLocaleString()}
          change={`${r.growth}%`}
          icon={Users}
          points={[9, 9, 15, 12, 19, 14, 23, 21, 30, 26, 34, 38]}
        />
        <StatCard
          label="Average revenue / user"
          value={money(r.revenue / r.customers)}
          change={`${((r.revenue / r.previous / (1 + Number(r.growth) / 100) - 1) * 100).toFixed(1)}%`}
          icon={CreditCard}
          points={[8, 17, 11, 20, 18, 23, 17, 29, 26, 33, 27, 35]}
        />
        <StatCard
          label="Customer churn rate"
          value={`${r.churn}%`}
          change="0.6 pp"
          icon={TrendingUp}
          points={[33, 27, 32, 24, 28, 19, 22, 14, 19, 12, 15, 6]}
          down
        />
      </div>
      <div className="chart-grid">
        <RevenueChart key={range} range={range} />
        <PlanChart range={range} />
      </div>
      <div className="insight-banner">
        <span className="insight-icon">
          <Sparkles size={18} />
        </span>
        <div>
          <strong>You’re building momentum.</strong>
          <span>
            {" "}
            Revenue is up {trend}% this period. Your Business plan is leading
            the way with 48% of total revenue.
          </span>
        </div>
        <Link href="/analytics">
          View insights <ArrowRight size={15} />
        </Link>
      </div>
      <div className="bottom-grid">
        <section className="card recent-card">
          <div className="card-header">
            <div className="inline-title">
              <h2>Recent customers</h2>
              <span className="count-pill">{customers.length}</span>
            </div>
            <Link href="/customers" className="text-link">
              View all customers <ArrowRight size={14} />
            </Link>
          </div>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Plan</th>
                  <th>Status</th>
                  <th className="align-right">Monthly revenue</th>
                </tr>
              </thead>
              <tbody>
                {customers.slice(0, 5).map((c) => (
                  <tr key={c.id}>
                    <td>
                      <Link
                        href={`/customers?search=${encodeURIComponent(c.email)}`}
                        className="customer-cell"
                      >
                        <Avatar name={c.name} color={c.color} />
                        <span>
                          <strong>{c.name}</strong>
                          <small>{c.email}</small>
                        </span>
                      </Link>
                    </td>
                    <td>
                      <span className={`plan-tag ${c.plan.toLowerCase()}`}>
                        {c.plan}
                      </span>
                    </td>
                    <td>
                      <Badge status={c.status} />
                    </td>
                    <td className="align-right revenue-number">
                      {money(c.status === "Active" ? prices[c.plan] : 0)}
                      <small>/mo</small>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="table-footer">
            <span>A few of the people growing with you.</span>
            <Link href="/customers?new=true">
              <Plus size={13} /> Add customer
            </Link>
          </div>
        </section>
        <section className="card activity-card">
          <div className="card-header">
            <h2>Recent activity</h2>
            <span className="muted">This month</span>
          </div>
          <div className="activity-list">
            {[
              {
                icon: UserPlus,
                color: "lilac",
                title: `${customers[0]?.name || "Olivia Rhye"} joined`,
                text: `Subscribed to the ${customers[0]?.plan || "Pro"} plan`,
                time: "May 31",
                amount: `+${money(prices[customers[0]?.plan || "Pro"])}`,
              },
              {
                icon: ArrowUpRight,
                color: "mint",
                title: "Plan upgrade",
                text: "Phoenix Baker moved to Business",
                time: "May 30",
                amount: "+$120",
              },
              {
                icon: CreditCard,
                color: "blue",
                title: "Payment received",
                text: "Demi Wilkinson · Pro plan",
                time: "May 28",
                amount: "+$79",
              },
              {
                icon: ArrowDownRight,
                color: "peach",
                title: "Subscription canceled",
                text: "Natali Craig · Starter plan",
                time: "May 26",
                amount: "",
              },
            ].map((a, i) => (
              <div className="activity-item" key={i}>
                <span className={`activity-icon ${a.color}`}>
                  <a.icon size={16} />
                </span>
                <div>
                  <strong>{a.title}</strong>
                  <p>{a.text}</p>
                  <small>{a.time}</small>
                </div>
                {a.amount && (
                  <span className="activity-amount">{a.amount}</span>
                )}
              </div>
            ))}
          </div>
          <Link href="/billing" className="activity-link">
            View billing activity <ArrowRight size={14} />
          </Link>
        </section>
      </div>
    </div>
  );
}
