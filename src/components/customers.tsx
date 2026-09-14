"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowDownUp,
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Download,
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useWorkspace } from "./providers";
import { PageHeading, Badge, EmptyState } from "./common";
import { Button } from "./ui/button";
import { Modal } from "./ui/dialog";
import { Avatar } from "./shell";
import { downloadCsv, money } from "@/lib/utils";
import {
  prices,
  type Customer,
  type Plan,
  type CustomerStatus,
} from "@/lib/data";
export function Customers() {
  const params = useSearchParams();
  return (
    <CustomerDirectory
      key={params.toString()}
      initialQuery={params.get("search") || ""}
      initialNew={params.get("new") === "true"}
    />
  );
}
function CustomerDirectory({
  initialQuery,
  initialNew,
}: {
  initialQuery: string;
  initialNew: boolean;
}) {
  const { customers, setCustomers, notify, ready } = useWorkspace();
  const [query, setQuery] = useState(initialQuery);
  const [status, setStatus] = useState("All");
  const [plan, setPlan] = useState("All");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [editing, setEditing] = useState<Customer | "new" | null>(
    initialNew ? "new" : null,
  );
  const [formError, setFormError] = useState("");
  const [filters, setFilters] = useState(false);
  const filtered = customers
    .filter(
      (c) =>
        (status === "All" || c.status === status) &&
        (plan === "All" || c.plan === plan) &&
        `${c.name} ${c.email} ${c.company}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    )
    .sort((a, b) =>
      sort === "name"
        ? a.name.localeCompare(b.name)
        : sort === "revenue"
          ? prices[b.plan] - prices[a.plan]
          : b.joined.localeCompare(a.joined),
    );
  const pages = Math.max(1, Math.ceil(filtered.length / 8));
  const currentPage = Math.min(page, pages);
  const visible = filtered.slice((currentPage - 1) * 8, currentPage * 8);
  const allSelected =
    visible.length > 0 && visible.every((c) => selected.includes(c.id));
  const exportCustomers = () => {
    const rows = selected.length
      ? customers.filter((c) => selected.includes(c.id))
      : filtered;
    downloadCsv("metricflow-customers.csv", [
      [
        "Name",
        "Email",
        "Company",
        "Plan",
        "Status",
        "Monthly revenue (USD)",
        "Joined",
      ],
      ...rows.map((c) => [
        c.name,
        c.email,
        c.company,
        c.plan,
        c.status,
        c.status === "Active" ? prices[c.plan] : 0,
        c.joined,
      ]),
    ]);
    notify(`${rows.length} customers exported.`);
  };
  function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name")).trim();
    const email = String(f.get("email")).trim().toLowerCase();
    const company = String(f.get("company")).trim();
    if (!name || !company) {
      setFormError("Please enter a name and company.");
      return;
    }
    if (
      customers.some(
        (c) =>
          c.email.toLowerCase() === email &&
          (editing === "new" || c.id !== editing?.id),
      )
    ) {
      setFormError("A customer with this email already exists.");
      return;
    }
    const base =
      editing === "new" || !editing
        ? {
            id: `CUS-${crypto.randomUUID().slice(0, 8)}`,
            joined: new Date().toISOString().slice(0, 10),
            color: "lilac",
          }
        : editing;
    const record: Customer = {
      ...base,
      name,
      email,
      company,
      plan: f.get("plan") as Plan,
      status: f.get("status") as CustomerStatus,
    };
    setCustomers(
      editing === "new"
        ? [record, ...customers]
        : customers.map((c) => (c.id === record.id ? record : c)),
    );
    notify(
      editing === "new"
        ? `${name} added to your workspace.`
        : "Customer details updated.",
    );
    setEditing(null);
    setFormError("");
  }
  const openEdit = (value: Customer | "new") => {
    setEditing(value);
    setFormError("");
  };
  return (
    <div className="page">
      <PageHeading
        eyebrow="GOOD RELATIONSHIPS START HERE"
        title="Customers"
        description="A little closer to the people behind your growth."
      >
        <Button variant="outline" onClick={exportCustomers}>
          <Download size={16} />
          Export{selected.length ? ` (${selected.length})` : ""}
        </Button>
        <Button onClick={() => openEdit("new")} disabled={!ready}>
          <Plus size={17} />
          Add customer
        </Button>
      </PageHeading>
      <div className="customer-summary">
        <div>
          <span className="notice-icon lilac">
            <Users size={20} />
          </span>
          <div>
            <small>Sample customers</small>
            <strong>
              {customers.length}
              <span>across all plans</span>
            </strong>
          </div>
        </div>
        <div>
          <span className="notice-icon mint">
            <Check size={20} />
          </span>
          <div>
            <small>Active accounts</small>
            <strong>
              {customers.filter((c) => c.status === "Active").length}
              <span>growing with you</span>
            </strong>
          </div>
        </div>
        <div>
          <span className="notice-icon blue">
            <UserPlus size={20} />
          </span>
          <div>
            <small>On a free trial</small>
            <strong>
              {customers.filter((c) => c.status === "Trial").length}
              <span>exploring the possibilities</span>
            </strong>
          </div>
        </div>
      </div>
      <section className="card customer-directory">
        <div className="directory-top">
          <div
            className="filter-tabs"
            role="group"
            aria-label="Filter by customer status"
          >
            {["All", "Active", "Trial", "Canceled"].map((s) => (
              <button
                key={s}
                className={status === s ? "selected" : ""}
                onClick={() => {
                  setStatus(s);
                  setPage(1);
                  setSelected([]);
                }}
              >
                {s === "All" ? "All customers" : s}
                <span>
                  {s === "All"
                    ? customers.length
                    : customers.filter((c) => c.status === s).length}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="table-toolbar">
          <div className="input-with-icon search-input">
            <Search size={17} />
            <input
              aria-label="Search customers"
              placeholder="Search name, email, or company..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
                setSelected([]);
              }}
            />
            {query && (
              <button aria-label="Clear search" onClick={() => setQuery("")}>
                <X size={15} />
              </button>
            )}
          </div>
          <div className="toolbar-controls">
            <label className="sort-select">
              <ArrowDownUp size={15} />
              <select
                aria-label="Sort customers"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="newest">Newest first</option>
                <option value="name">Name A–Z</option>
                <option value="revenue">Highest plan price</option>
              </select>
              <ChevronDown size={13} />
            </label>
            <Button variant="outline" onClick={() => setFilters(!filters)}>
              <SlidersHorizontal size={15} />
              Filters{plan !== "All" && <span className="active-dot" />}
            </Button>
          </div>
        </div>
        {filters && (
          <div className="filter-panel">
            <label>
              Plan{" "}
              <select
                aria-label="Filter by plan"
                value={plan}
                onChange={(e) => {
                  setPlan(e.target.value);
                  setPage(1);
                  setSelected([]);
                }}
              >
                <option value="All">All plans</option>
                <option>Starter</option>
                <option>Pro</option>
                <option>Business</option>
              </select>
            </label>
            <button
              className="text-link"
              onClick={() => {
                setPlan("All");
                setStatus("All");
                setQuery("");
                setSelected([]);
              }}
            >
              Reset filters
            </button>
          </div>
        )}
        {selected.length > 0 && (
          <div className="selection-bar">
            <span>{selected.length} customers selected</span>
            <button onClick={exportCustomers}>
              Export selected <Download size={14} />
            </button>
            <button onClick={() => setSelected([])}>Clear selection</button>
          </div>
        )}
        <div className="table-scroll">
          <table className="customers-table">
            <thead>
              <tr>
                <th className="checkbox-cell">
                  <input
                    type="checkbox"
                    aria-label="Select all customers on this page"
                    checked={allSelected}
                    onChange={() =>
                      setSelected(
                        allSelected
                          ? selected.filter(
                              (id) => !visible.some((c) => c.id === id),
                            )
                          : [
                              ...new Set([
                                ...selected,
                                ...visible.map((c) => c.id),
                              ]),
                            ],
                      )
                    }
                  />
                </th>
                <th>Customer</th>
                <th>Company</th>
                <th>Plan</th>
                <th>Status</th>
                <th>Joined</th>
                <th>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {visible.map((c) => (
                <tr
                  key={c.id}
                  className={selected.includes(c.id) ? "row-selected" : ""}
                >
                  <td className="checkbox-cell">
                    <input
                      type="checkbox"
                      aria-label={`Select ${c.name}`}
                      checked={selected.includes(c.id)}
                      onChange={() =>
                        setSelected(
                          selected.includes(c.id)
                            ? selected.filter((id) => id !== c.id)
                            : [...selected, c.id],
                        )
                      }
                    />
                  </td>
                  <td>
                    <button
                      className="customer-cell"
                      onClick={() => openEdit(c)}
                    >
                      <Avatar name={c.name} color={c.color} />
                      <span>
                        <strong>{c.name}</strong>
                        <small>{c.email}</small>
                      </span>
                    </button>
                  </td>
                  <td>{c.company}</td>
                  <td>
                    <span className={`plan-tag ${c.plan.toLowerCase()}`}>
                      {c.plan}
                    </span>
                  </td>
                  <td>
                    <Badge status={c.status} />
                  </td>
                  <td className="muted">
                    {new Date(c.joined + "T12:00:00Z").toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        timeZone: "UTC",
                      },
                    )}
                  </td>
                  <td>
                    <button
                      className="icon-button"
                      aria-label={`Edit ${c.name}`}
                      onClick={() => openEdit(c)}
                    >
                      <MoreHorizontal size={19} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!visible.length && (
          <EmptyState
            title="No customers found"
            description="Try another search or clear your filters to see more customers."
          />
        )}
        <div className="pagination">
          <span>
            Showing {filtered.length ? (currentPage - 1) * 8 + 1 : 0}–
            {Math.min(currentPage * 8, filtered.length)} of {filtered.length}{" "}
            customers
          </span>
          <div>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setPage(currentPage - 1)}
            >
              <ArrowLeft size={14} />
              Previous
            </Button>
            <span>
              Page {currentPage} of {pages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === pages}
              onClick={() => setPage(currentPage + 1)}
            >
              Next
              <ArrowRight size={14} />
            </Button>
          </div>
        </div>
      </section>
      <p className="data-note">
        This directory contains sample accounts from the larger reporting
        dataset. Your edits are saved in this browser.
      </p>
      <Modal
        open={!!editing}
        onOpenChange={(o) => {
          if (!o) setEditing(null);
        }}
        title={editing === "new" ? "Add a new customer" : "Customer details"}
        description={
          editing === "new"
            ? "Make room for your next great customer."
            : "Keep the details up to date and the relationship growing."
        }
      >
        {editing && (
          <form
            key={editing === "new" ? "new" : editing.id}
            onSubmit={save}
            className="form-stack"
          >
            {editing !== "new" && (
              <div className="customer-detail-header">
                <Avatar name={editing.name} color={editing.color} />
                <div>
                  <strong>{editing.name}</strong>
                  <small>
                    {editing.id} · {money(prices[editing.plan])}/month
                  </small>
                </div>
                <Badge status={editing.status} />
              </div>
            )}
            <label>
              Full name
              <input
                name="name"
                defaultValue={editing === "new" ? "" : editing.name}
                placeholder="e.g. Jamie Parker"
                required
                maxLength={80}
              />
            </label>
            <label>
              Email address
              <input
                name="email"
                type="email"
                defaultValue={editing === "new" ? "" : editing.email}
                placeholder="jamie@company.com"
                required
                maxLength={120}
              />
            </label>
            <label>
              Company
              <input
                name="company"
                defaultValue={editing === "new" ? "" : editing.company}
                placeholder="Company name"
                required
                maxLength={80}
              />
            </label>
            <div className="form-grid">
              <label>
                Plan
                <select
                  name="plan"
                  defaultValue={editing === "new" ? "Pro" : editing.plan}
                >
                  {Object.entries(prices).map(([p, v]) => (
                    <option key={p} value={p}>
                      {p} · {money(v)}/mo
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Status
                <select
                  name="status"
                  defaultValue={editing === "new" ? "Active" : editing.status}
                >
                  <option>Active</option>
                  <option>Trial</option>
                  <option>Canceled</option>
                </select>
              </label>
            </div>
            {formError && (
              <p className="form-error" role="alert">
                {formError}
              </p>
            )}
            <div className="form-actions">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditing(null)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editing === "new" ? (
                  <>
                    <Plus size={16} />
                    Add customer
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
