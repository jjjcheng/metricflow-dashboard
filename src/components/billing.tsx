"use client";
import { useState } from "react";
import {
  ArrowDownToLine,
  CheckCheck,
  Clock3,
  DollarSign,
  FileText,
  Search,
  TriangleAlert,
} from "lucide-react";
import { PageHeading, ExportButton, Badge, EmptyState } from "./common";
import { Modal } from "./ui/dialog";
import { Button } from "./ui/button";
import { Avatar } from "./shell";
import { invoices, type Invoice } from "@/lib/data";
import { money, downloadCsv } from "@/lib/utils";
import { useWorkspace } from "./providers";
export function Billing() {
  const { notify, settings } = useWorkspace();
  const [status, setStatus] = useState("All");
  const [query, setQuery] = useState("");
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const filtered = invoices.filter(
    (i) =>
      (status === "All" || i.status === status) &&
      `${i.id} ${i.name} ${i.email}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const exportInvoices = (rows: Invoice[]) => {
    downloadCsv(
      rows.length === 1 ? `${rows[0].id}.csv` : "metricflow-invoices.csv",
      [
        [
          "Invoice",
          "Customer",
          "Email",
          "Plan",
          "Date",
          "Amount (USD)",
          "Status",
        ],
        ...rows.map((i) => [
          i.id,
          i.name,
          i.email,
          i.plan,
          i.date,
          i.amount,
          i.status,
        ]),
      ],
    );
    notify(
      rows.length === 1
        ? "Invoice downloaded."
        : `${rows.length} invoices exported.`,
    );
  };
  return (
    <div className="page">
      <PageHeading
        eyebrow="THE DETAILS, ALL TAKEN CARE OF"
        title="Billing & invoices"
        description="Every payment and every invoice, right where you need it."
      >
        <ExportButton
          label="Export invoices"
          onClick={() => exportInvoices(filtered)}
        />
      </PageHeading>
      <div className="billing-stats">
        {[
          {
            label: "Total invoiced",
            amount: invoices.reduce((s, i) => s + i.amount, 0),
            icon: FileText,
            color: "lilac",
            detail: `${invoices.length} sample invoices`,
          },
          {
            label: "Collected",
            amount: invoices
              .filter((i) => i.status === "Paid")
              .reduce((s, i) => s + i.amount, 0),
            icon: CheckCheck,
            color: "mint",
            detail: "Successfully paid",
          },
          {
            label: "Pending",
            amount: invoices
              .filter((i) => i.status === "Pending")
              .reduce((s, i) => s + i.amount, 0),
            icon: Clock3,
            color: "blue",
            detail: "Awaiting payment",
          },
          {
            label: "Overdue",
            amount: invoices
              .filter((i) => i.status === "Overdue")
              .reduce((s, i) => s + i.amount, 0),
            icon: TriangleAlert,
            color: "peach",
            detail: "Needs a little attention",
          },
        ].map((s) => (
          <article className="card billing-stat" key={s.label}>
            <span className={`notice-icon ${s.color}`}>
              <s.icon size={20} />
            </span>
            <small>{s.label}</small>
            <strong>{money(s.amount)}</strong>
            <p>{s.detail}</p>
          </article>
        ))}
      </div>
      <section className="card">
        <div className="card-header">
          <div>
            <h2>Invoice history</h2>
            <p>Your sample billing records for May 2026.</p>
          </div>
          <span className="tag">
            <DollarSign size={13} /> USD
          </span>
        </div>
        <div className="table-toolbar">
          <div className="filter-tabs" role="group" aria-label="Invoice status">
            {["All", "Paid", "Pending", "Overdue"].map((s) => (
              <button
                className={status === s ? "selected" : ""}
                key={s}
                onClick={() => setStatus(s)}
              >
                {s === "All" ? "All invoices" : s}
              </button>
            ))}
          </div>
          <div className="input-with-icon search-input">
            <Search size={16} />
            <input
              aria-label="Search invoices"
              placeholder="Search invoices..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((i) => (
                <tr key={i.id}>
                  <td>
                    <button
                      className="invoice-id"
                      onClick={() => setInvoice(i)}
                    >
                      <span className="file-icon">
                        <FileText size={17} />
                      </span>
                      {i.id}
                    </button>
                  </td>
                  <td>
                    <div className="customer-cell">
                      <Avatar name={i.name} small />
                      <span>
                        <strong>{i.name}</strong>
                        <small>{i.plan} plan</small>
                      </span>
                    </div>
                  </td>
                  <td className="muted">
                    May {Number(i.date.slice(-2))}, 2026
                  </td>
                  <td className="revenue-number">{money(i.amount)}</td>
                  <td>
                    <Badge status={i.status} />
                  </td>
                  <td>
                    <button
                      className="icon-button"
                      aria-label={`Download ${i.id}`}
                      onClick={() => exportInvoices([i])}
                    >
                      <ArrowDownToLine size={17} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!filtered.length && (
          <EmptyState
            title="No invoices found"
            description="Try a different invoice number, customer, or status."
          />
        )}
        <div className="table-footer">
          <span>{filtered.length} invoices</span>
          <span>Securely organized. Always in view.</span>
        </div>
      </section>
      <p className="data-note">
        Historical sample invoices are fixed records. Editing a customer’s
        current plan does not alter past invoices.
      </p>
      <Modal
        open={!!invoice}
        onOpenChange={(o) => {
          if (!o) setInvoice(null);
        }}
        title="Invoice details"
        description="Everything you need for your records."
      >
        {invoice && (
          <div className="invoice-detail">
            <div className="invoice-detail-top">
              <div>
                <span className="eyebrow">{settings.workspace}</span>
                <h2>{invoice.id}</h2>
              </div>
              <Badge status={invoice.status} />
            </div>
            <div className="invoice-parties">
              <div>
                <small>BILLED TO</small>
                <strong>{invoice.name}</strong>
                <span>{invoice.email}</span>
              </div>
              <div>
                <small>ISSUED ON</small>
                <strong>May {Number(invoice.date.slice(-2))}, 2026</strong>
                <span>Currency: USD</span>
              </div>
            </div>
            <div className="invoice-line">
              <span>
                {invoice.plan} subscription <small>1 month · May 2026</small>
              </span>
              <strong>{money(invoice.amount)}</strong>
            </div>
            <div className="invoice-total">
              <span>Total</span>
              <strong>{money(invoice.amount)}</strong>
            </div>
            <p className="data-note">Demo invoice · No payment is requested.</p>
            <Button
              className="full-width"
              onClick={() => exportInvoices([invoice])}
            >
              <ArrowDownToLine size={16} />
              Download invoice CSV
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
