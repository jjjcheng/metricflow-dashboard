"use client";
import { useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  CreditCard,
  Layers,
  Search,
  Sparkles,
} from "lucide-react";
import { useWorkspace } from "./providers";
import { PageHeading, Badge, EmptyState } from "./common";
import { Button } from "./ui/button";
import { Modal } from "./ui/dialog";
import { Avatar } from "./shell";
import { prices, type Customer, type Plan } from "@/lib/data";
import { money } from "@/lib/utils";
export function Subscriptions() {
  const { customers, setCustomers, notify } = useWorkspace();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [editing, setEditing] = useState<Customer | null>(null);
  const [newPlan, setNewPlan] = useState<Plan>("Pro");
  const [showPlan, setShowPlan] = useState<Plan | null>(null);
  const filtered = customers.filter(
    (c) =>
      (filter === "All" || c.plan === filter) &&
      `${c.name} ${c.email}`.toLowerCase().includes(query.toLowerCase()),
  );
  const active = customers.filter((c) => c.status === "Active");
  const features: Record<Plan, string[]> = {
    Starter: [
      "Up to 3 team members",
      "Core analytics & reports",
      "Customer management",
      "Community support",
    ],
    Pro: [
      "Up to 15 team members",
      "Advanced analytics",
      "Custom exports & filters",
      "Priority email support",
    ],
    Business: [
      "Unlimited team members",
      "Everything in Pro",
      "Custom reporting",
      "Dedicated account manager",
    ],
  };
  return (
    <div className="page">
      <PageHeading
        eyebrow="BUILT FOR EVERY STAGE OF GROWTH"
        title="Subscriptions"
        description="The right plans for your customers. Room for what’s next."
      >
        <span className="tag">
          <CreditCard size={15} />
          Monthly billing
        </span>
      </PageHeading>
      <div className="pricing-grid">
        {(["Starter", "Pro", "Business"] as Plan[]).map((p, i) => (
          <section
            key={p}
            className={`card pricing-card ${p === "Pro" ? "featured" : ""}`}
          >
            <div className="pricing-top">
              <span className={`notice-icon ${["blue", "lilac", "peach"][i]}`}>
                {i === 0 ? (
                  <Layers size={22} />
                ) : i === 1 ? (
                  <Sparkles size={22} />
                ) : (
                  <CreditCard size={22} />
                )}
              </span>
              {p === "Pro" && <span className="popular-tag">Most popular</span>}
            </div>
            <h2>{p}</h2>
            <p>
              {
                [
                  "For the next big idea.",
                  "For teams finding their stride.",
                  "For ambitious, growing teams.",
                ][i]
              }
            </p>
            <div className="plan-price">
              {money(prices[p])}
              <span>/ month</span>
            </div>
            <ul>
              {features[p].map((f) => (
                <li key={f}>
                  <Check size={15} />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              variant={p === "Pro" ? "default" : "outline"}
              className="full-width"
              onClick={() => setShowPlan(p)}
            >
              Explore {p} <ArrowRight size={15} />
            </Button>
            <div className="pricing-count">
              {
                customers.filter((c) => c.plan === p && c.status === "Active")
                  .length
              }{" "}
              active sample subscriptions
            </div>
          </section>
        ))}
      </div>
      <div className="subscription-strip">
        <span>
          <span className="status-dot" />
          {active.length} active sample subscriptions
        </span>
        <span>
          Sample monthly recurring revenue{" "}
          <strong>
            {money(active.reduce((s, c) => s + prices[c.plan], 0))}
          </strong>
        </span>
      </div>
      <section className="card">
        <div className="card-header">
          <div>
            <h2>Customer subscriptions</h2>
            <p>Manage plans and keep renewals running smoothly.</p>
          </div>
          <label className="mini-select">
            <select
              aria-label="Filter subscriptions by plan"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">All plans</option>
              <option>Starter</option>
              <option>Pro</option>
              <option>Business</option>
            </select>
          </label>
        </div>
        <div className="table-toolbar">
          <div className="input-with-icon search-input">
            <Search size={17} />
            <input
              aria-label="Search subscriptions"
              placeholder="Search customers..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <span className="muted">{filtered.length} subscriptions</span>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Plan</th>
                <th>Status</th>
                <th>Price / month</th>
                <th>Next renewal</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className="customer-cell">
                      <Avatar name={c.name} color={c.color} />
                      <span>
                        <strong>{c.name}</strong>
                        <small>{c.email}</small>
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className={`plan-tag ${c.plan.toLowerCase()}`}>
                      {c.plan}
                    </span>
                  </td>
                  <td>
                    <Badge status={c.status} />
                  </td>
                  <td>{money(prices[c.plan])}</td>
                  <td className="muted">
                    {c.status === "Canceled"
                      ? "—"
                      : new Date(
                          Date.UTC(
                            Number(c.joined.slice(0, 4)),
                            Number(c.joined.slice(5, 7)),
                            1,
                          ),
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          timeZone: "UTC",
                        })}
                  </td>
                  <td>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditing(c);
                        setNewPlan(c.plan);
                      }}
                    >
                      Manage
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!filtered.length && (
          <EmptyState
            title="No matching subscriptions"
            description="Try another name or choose a different plan."
          />
        )}
      </section>
      <p className="data-note">
        Sample subscription changes are saved locally. Renewals are
        illustrative; no real billing takes place.
      </p>
      <Modal
        open={!!editing}
        onOpenChange={(o) => {
          if (!o) setEditing(null);
        }}
        title="Manage subscription"
        description={`Choose what’s next for ${editing?.name || "your customer"}.`}
      >
        {editing && (
          <div className="form-stack">
            <div className="customer-detail-header">
              <Avatar name={editing.name} color={editing.color} />
              <div>
                <strong>{editing.name}</strong>
                <small>{editing.email}</small>
              </div>
              <Badge status={editing.status} />
            </div>
            <label>
              Subscription plan
              <select
                value={newPlan}
                onChange={(e) => setNewPlan(e.target.value as Plan)}
              >
                {Object.entries(prices).map(([p, v]) => (
                  <option key={p} value={p}>
                    {p} · {money(v)}/month
                  </option>
                ))}
              </select>
            </label>
            <div className="subscription-preview">
              <span>New monthly price</span>
              <strong>
                {money(prices[newPlan])}
                <small>/mo</small>
              </strong>
              <p>
                Changes take effect immediately in this demo. Historical
                invoices stay unchanged.
              </p>
            </div>
            <div className="form-actions split">
              <Button
                variant="ghost"
                onClick={() => {
                  setCustomers(
                    customers.map((c) =>
                      c.id === editing.id
                        ? {
                            ...c,
                            status:
                              c.status === "Canceled" ? "Active" : "Canceled",
                          }
                        : c,
                    ),
                  );
                  notify(
                    editing.status === "Canceled"
                      ? "Subscription reactivated."
                      : "Subscription canceled. You can reactivate it anytime.",
                  );
                  setEditing(null);
                }}
              >
                {editing.status === "Canceled"
                  ? "Reactivate subscription"
                  : "Cancel subscription"}
              </Button>
              <Button
                onClick={() => {
                  setCustomers(
                    customers.map((c) =>
                      c.id === editing.id ? { ...c, plan: newPlan } : c,
                    ),
                  );
                  notify(`${editing.name} is now on the ${newPlan} plan.`);
                  setEditing(null);
                }}
              >
                Save plan
              </Button>
            </div>
          </div>
        )}
      </Modal>
      <Modal
        open={!!showPlan}
        onOpenChange={(o) => {
          if (!o) setShowPlan(null);
        }}
        title={`Meet the ${showPlan} plan`}
        description="A little more capability for your next chapter."
      >
        {showPlan && (
          <div className="plan-explainer">
            <div className="plan-price">
              {money(prices[showPlan])}
              <span>/ month per account</span>
            </div>
            {features[showPlan].map((f) => (
              <p key={f}>
                <CheckCircle2 size={17} />
                {f}
              </p>
            ))}
            <div className="info-box">
              To assign this plan, use Manage on a customer subscription below.
              This demo does not take payments.
            </div>
            <Button
              className="full-width"
              onClick={() => {
                setFilter(showPlan);
                setShowPlan(null);
              }}
            >
              View {showPlan} subscriptions <ArrowRight size={15} />
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
