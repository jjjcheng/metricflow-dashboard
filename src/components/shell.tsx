"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  ArrowRight,
  Bell,
  BookOpen,
  ChartNoAxesCombined,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Command,
  CreditCard,
  ExternalLink,
  LayoutDashboard,
  Menu,
  Moon,
  Search,
  Settings2,
  Sparkles,
  Sun,
  Users,
  X,
} from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { useWorkspace } from "./providers";
import { Modal } from "./ui/dialog";

export const navigation = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/analytics", label: "Analytics", icon: ChartNoAxesCombined },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/subscriptions", label: "Subscriptions", icon: CreditCard },
  { href: "/billing", label: "Billing & invoices", icon: BookOpen },
  { href: "/settings", label: "Settings", icon: Settings2 },
];
export function Brand() {
  return (
    <Link className="brand" href="/" aria-label="MetricFlow overview">
      <span className="brand-mark">
        <span />
        <span />
        <span />
      </span>
      MetricFlow<span className="brand-dot">.</span>
    </Link>
  );
}
export function Avatar({
  name,
  color = "lilac",
  small = false,
}: {
  name: string;
  color?: string;
  small?: boolean;
}) {
  return (
    <span className={`avatar ${color} ${small ? "avatar-sm" : ""}`}>
      {name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")}
    </span>
  );
}
export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { settings, customers, ready } = useWorkspace();
  const { resolvedTheme, setTheme } = useTheme();
  const [mobile, setMobile] = useState(false);
  const [dialog, setDialog] = useState<
    "search" | "help" | "notifications" | "workspace" | null
  >(null);
  const [query, setQuery] = useState("");
  const [read, setRead] = useState(false);
  const current =
    navigation.find((n) => n.href === pathname)?.label ?? "Workspace";
  const sidebar = (
    <>
      <Brand />
      <button
        className="workspace-switch"
        onClick={() => setDialog("workspace")}
      >
        <span className="workspace-logo">
          a<span>✳</span>
        </span>
        <span>
          <strong>{settings.workspace}</strong>
          <small>
            Pro workspace <span>PRO</span>
          </small>
        </span>
        <ChevronDown size={15} />
      </button>
      <span className="nav-caption">WORKSPACE</span>
      <nav aria-label="Main navigation">
        {navigation.map(({ href, label, icon: Icon }) => (
          <Link
            onClick={() => setMobile(false)}
            href={href}
            key={href}
            className={`nav-item ${pathname === href ? "active" : ""}`}
            aria-current={pathname === href ? "page" : undefined}
          >
            <Icon size={19} />
            <span>{label}</span>
            {href === "/customers" && (
              <span className="nav-count">{customers.length}</span>
            )}
            {href === "/" && pathname === "/" && (
              <span className="active-dot" />
            )}
          </Link>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <div className="upgrade-card">
          <span className="upgrade-icon">
            <Sparkles size={18} />
          </span>
          <strong>A little more room to grow.</strong>
          <p>Unlock more possibilities with our Business plan.</p>
          <Link href="/subscriptions" onClick={() => setMobile(false)}>
            Explore plans <ArrowRight size={15} />
          </Link>
        </div>
        <button
          className="nav-item help-link"
          onClick={() => setDialog("help")}
        >
          <CircleHelp size={18} />
          <span>Help & resources</span>
          <ExternalLink size={14} />
        </button>
        <Link
          href="/settings"
          className="profile"
          onClick={() => setMobile(false)}
        >
          <Avatar name={settings.name} color="peach" />
          <span>
            <strong>{settings.name}</strong>
            <small>Workspace admin</small>
          </span>
          <ChevronDown size={15} />
        </Link>
      </div>
    </>
  );
  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <aside className="sidebar">{sidebar}</aside>
      <Dialog.Root open={mobile} onOpenChange={setMobile}>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content className="mobile-sidebar">
            <Dialog.Title className="sr-only">
              Workspace navigation
            </Dialog.Title>
            <Dialog.Description className="sr-only">
              Navigate your MetricFlow workspace.
            </Dialog.Description>
            <Dialog.Close
              className="mobile-close"
              aria-label="Close navigation"
            >
              <X size={20} />
            </Dialog.Close>
            {sidebar}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumb">
            <button
              className="icon-button mobile-menu"
              onClick={() => setMobile(true)}
              aria-label="Open navigation"
            >
              <Menu size={21} />
            </button>
            <span className="desktop-crumb">Workspace</span>
            <ChevronRight size={14} className="desktop-crumb" />
            <strong>{current}</strong>
          </div>
          <div className="topbar-actions">
            <button
              className="search-trigger"
              aria-label="Search workspace"
              onClick={() => setDialog("search")}
            >
              <Search size={17} />
              <span>Search anything...</span>
              <kbd>
                <Command size={10} /> K
              </kbd>
            </button>
            <span className="topbar-divider" />
            <button
              className="icon-button"
              aria-label="Toggle color theme"
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
            >
              {ready && resolvedTheme === "dark" ? (
                <Sun size={19} />
              ) : (
                <Moon size={19} />
              )}
            </button>
            <button
              className="icon-button notification-button"
              aria-label="Open notifications"
              onClick={() => {
                setDialog("notifications");
                setRead(true);
              }}
            >
              <Bell size={19} />
              {!read && <i />}
            </button>
            <Link href="/settings" aria-label="Your profile">
              <Avatar name={settings.name} color="peach" small />
            </Link>
          </div>
        </header>
        <main id="main-content">{children}</main>
        <footer className="app-footer">
          <span>
            <span className="status-dot" /> All systems operational
          </span>
          <span>
            Made for the way you grow.{" "}
            <span className="footer-brand">MetricFlow</span>
            <span className="demo-label">Demo workspace</span>
          </span>
        </footer>
      </div>
      <Modal
        open={dialog === "search"}
        onOpenChange={(o) => {
          if (!o) setDialog(null);
        }}
        title="Find your next destination"
        description="Search workspace pages and sample customers."
      >
        <div className="input-with-icon">
          <Search size={18} />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages or customers..."
            aria-label="Search workspace"
          />
        </div>
        <div className="search-results">
          {navigation
            .filter((n) => n.label.toLowerCase().includes(query.toLowerCase()))
            .map((n) => (
              <Link key={n.href} href={n.href} onClick={() => setDialog(null)}>
                <n.icon size={18} />
                <span>{n.label}</span>
                <ChevronRight size={15} />
              </Link>
            ))}
          {query &&
            customers
              .filter((c) =>
                `${c.name} ${c.email} ${c.company}`
                  .toLowerCase()
                  .includes(query.toLowerCase()),
              )
              .slice(0, 5)
              .map((c) => (
                <Link
                  key={c.id}
                  href={`/customers?search=${encodeURIComponent(c.email)}`}
                  onClick={() => setDialog(null)}
                >
                  <Avatar name={c.name} color={c.color} small />
                  <span>
                    {c.name}
                    <small>{c.company}</small>
                  </span>
                  <ArrowRight size={15} />
                </Link>
              ))}
          {query &&
            !navigation.some((n) =>
              n.label.toLowerCase().includes(query.toLowerCase()),
            ) &&
            !customers.some((c) =>
              `${c.name} ${c.email} ${c.company}`
                .toLowerCase()
                .includes(query.toLowerCase()),
            ) && (
              <div className="empty-state compact">
                <Search />
                <strong>No results found</strong>
                <p>Try a page name, customer, or company.</p>
              </div>
            )}
        </div>
      </Modal>
      <Modal
        open={dialog === "notifications"}
        onOpenChange={(o) => {
          if (!o) setDialog(null);
        }}
        title="You’re all caught up"
        description="A few good things happening in your demo workspace."
      >
        <div className="notification-item">
          <span className="notice-icon mint">
            <Check size={19} />
          </span>
          <div>
            <strong>May report is ready</strong>
            <p>Revenue grew 14.5% compared with the previous period.</p>
            <small>May 31, 2026 · Revenue</small>
          </div>
        </div>
        <div className="notification-item">
          <span className="notice-icon lilac">
            <Users size={19} />
          </span>
          <div>
            <strong>Your customer directory is ready</strong>
            <p>Explore 24 sample accounts, edit details, or add your own.</p>
            <small>May 31, 2026 · Workspace</small>
          </div>
        </div>
        <Link
          className="btn btn-outline full-width"
          href="/analytics"
          onClick={() => setDialog(null)}
        >
          Explore analytics <ArrowRight size={15} />
        </Link>
      </Modal>
      <Modal
        open={dialog === "help"}
        onOpenChange={(o) => {
          if (!o) setDialog(null);
        }}
        title="A good place to start"
        description="Meet MetricFlow, your business at a glance."
      >
        <div className="help-content">
          <p>
            <strong>Explore the workspace</strong>
            <br />
            Switch reporting periods, inspect revenue charts, and export your
            data.
          </p>
          <p>
            <strong>Make it your own</strong>
            <br />
            Add customers, adjust their subscriptions, and update your workspace
            in Settings. Your changes are saved in this browser.
          </p>
          <p>
            <strong>About this demo</strong>
            <br />
            This portfolio project uses fictional accounts and a May 2026
            reporting snapshot. No payments are processed or emails sent.
            Customer and invoice pages show a sample of the full analytics
            dataset.
          </p>
          <Link
            href="/settings"
            className="btn btn-primary"
            onClick={() => setDialog(null)}
          >
            Open workspace settings <ArrowRight size={15} />
          </Link>
        </div>
      </Modal>
      <Modal
        open={dialog === "workspace"}
        onOpenChange={(o) => {
          if (!o) setDialog(null);
        }}
        title="Your workspace"
        description="One home for your customers, subscriptions, and growth."
      >
        <div className="workspace-option">
          <span className="workspace-logo">
            a<span>✳</span>
          </span>
          <div>
            <strong>{settings.workspace}</strong>
            <p>Pro plan · Demo workspace</p>
          </div>
          <Check size={20} />
        </div>
        <Link
          className="btn btn-outline full-width"
          href="/settings"
          onClick={() => setDialog(null)}
        >
          <Settings2 size={16} /> Manage workspace
        </Link>
      </Modal>
      <KeyboardSearch onOpen={() => setDialog("search")} />
    </div>
  );
}
import { useEffect } from "react";
function KeyboardSearch({ onOpen }: { onOpen: () => void }) {
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpen();
      }
    };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [onOpen]);
  return null;
}
