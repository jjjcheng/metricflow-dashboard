"use client";
import { useState } from "react";
import { useTheme } from "next-themes";
import { Bell, Check, Laptop, Moon, RotateCcw, Save, Sun } from "lucide-react";
import { useWorkspace } from "./providers";
import { PageHeading } from "./common";
import { Button } from "./ui/button";
import { Modal } from "./ui/dialog";
import { Avatar } from "./shell";
import { type Settings as WorkspaceSettings } from "@/lib/data";
export function Settings() {
  const { settings, saveSettings, notify, reset, ready } = useWorkspace();
  const [tab, setTab] = useState("My profile");
  const [resetOpen, setResetOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    if (tab === "My profile") {
      const name = String(f.get("name")).trim();
      if (!name) return;
      saveSettings({ ...settings, name, email: String(f.get("email")).trim() });
    } else {
      const workspace = String(f.get("workspace")).trim();
      if (!workspace) return;
      saveSettings({
        ...settings,
        workspace,
        website: String(f.get("website")).trim(),
      });
    }
    notify("Your changes have been saved.");
  }
  return (
    <div className="page settings-page">
      <PageHeading
        eyebrow="A WORKSPACE THAT FEELS LIKE YOU"
        title="Settings"
        description="Your profile, your preferences, your way of working."
      />
      <div
        className="settings-tabs"
        role="group"
        aria-label="Settings sections"
      >
        {["My profile", "Workspace", "Notifications", "Appearance"].map((t) => (
          <button
            key={t}
            className={tab === t ? "selected" : ""}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>
      {ready && (tab === "My profile" || tab === "Workspace") && (
        <form
          key={`${tab}-${settings.name}-${settings.workspace}`}
          onSubmit={save}
        >
          <section className="card settings-card">
            <div className="settings-section-heading">
              <h2>
                {tab === "My profile"
                  ? "Personal information"
                  : "Workspace details"}
              </h2>
              <p>
                {tab === "My profile"
                  ? "The details that make you, you."
                  : "Give your team a space to call their own."}
              </p>
            </div>
            {tab === "My profile" && (
              <div className="profile-preview">
                <Avatar name={settings.name} color="peach" />
                <div>
                  <strong>{settings.name}</strong>
                  <p>Workspace administrator</p>
                  <small>Your avatar is generated from your initials.</small>
                </div>
                <span className="tag">Admin</span>
              </div>
            )}
            <div className="settings-fields">
              {tab === "My profile" ? (
                <>
                  <label>
                    Full name
                    <input
                      name="name"
                      defaultValue={settings.name}
                      required
                      pattern=".*\S.*"
                      maxLength={80}
                    />
                    <small>How you’ll appear across the workspace.</small>
                  </label>
                  <label>
                    Email address
                    <input
                      name="email"
                      type="email"
                      defaultValue={settings.email}
                      required
                      maxLength={120}
                    />
                    <small>Demo profile only. No emails will be sent.</small>
                  </label>
                  <label>
                    Role
                    <input value="Workspace administrator" readOnly />
                    <small>You have full access to this demo workspace.</small>
                  </label>
                </>
              ) : (
                <>
                  <label>
                    Workspace name
                    <input
                      name="workspace"
                      defaultValue={settings.workspace}
                      required
                      pattern=".*\S.*"
                      maxLength={50}
                    />
                    <small>Visible in the sidebar and invoice details.</small>
                  </label>
                  <label>
                    Website
                    <input
                      name="website"
                      type="url"
                      defaultValue={settings.website}
                      placeholder="https://your-company.com"
                    />
                    <small>Your company’s home on the web.</small>
                  </label>
                  <label>
                    Reporting currency
                    <input value="USD — US Dollar" readOnly />
                    <small>This demo’s reporting dataset uses USD.</small>
                  </label>
                </>
              )}
            </div>
            <div className="settings-save">
              <span>Changes are saved in this browser.</span>
              <Button type="submit">
                <Save size={15} />
                Save changes
              </Button>
            </div>
          </section>
        </form>
      )}
      {tab === "Notifications" && (
        <section className="card settings-card">
          <div className="settings-section-heading">
            <h2>Keep the right things in the loop</h2>
            <p>
              Choose your preferences. These are saved locally for this demo.
            </p>
          </div>
          {[
            {
              key: "revenueAlerts",
              title: "Revenue alerts",
              description:
                "Milestones, payment updates, and important revenue changes.",
            },
            {
              key: "weeklyDigest",
              title: "Weekly digest",
              description: "A considered roundup of your business performance.",
            },
            {
              key: "productUpdates",
              title: "Product updates",
              description:
                "New features and small improvements to your workspace.",
            },
          ].map((n) => (
            <div className="notification-setting" key={n.key}>
              <span className="notice-icon lilac">
                <Bell size={18} />
              </span>
              <div>
                <strong>{n.title}</strong>
                <p>{n.description}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={!!settings[n.key as keyof WorkspaceSettings]}
                aria-label={n.title}
                className={`switch ${settings[n.key as keyof WorkspaceSettings] ? "on" : ""}`}
                onClick={() => {
                  saveSettings({
                    ...settings,
                    [n.key]: !settings[n.key as keyof WorkspaceSettings],
                  });
                  notify("Notification preference saved.");
                }}
              >
                <span />
              </button>
            </div>
          ))}
        </section>
      )}
      {tab === "Appearance" && (
        <section className="card settings-card">
          <div className="settings-section-heading">
            <h2>A different light</h2>
            <p>Choose a look that works for you, any time of day.</p>
          </div>
          <div className="theme-grid">
            {[
              { key: "light", label: "Light", icon: Sun },
              { key: "dark", label: "Dark", icon: Moon },
              { key: "system", label: "System", icon: Laptop },
            ].map((t) => (
              <button
                key={t.key}
                className={`theme-option ${ready && theme === t.key ? "selected" : ""}`}
                onClick={() => setTheme(t.key)}
                aria-pressed={ready && theme === t.key}
              >
                <div className={`theme-preview ${t.key}`}>
                  <aside />
                  <div>
                    <i />
                    <span />
                    <span />
                    <section>
                      <b />
                      <b />
                    </section>
                  </div>
                </div>
                <span>
                  <t.icon size={16} />
                  {t.label}
                  {ready && theme === t.key && <Check size={16} />}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}
      <section className="reset-card">
        <div>
          <h3>A fresh start</h3>
          <p>
            Restore the original sample customers and workspace preferences.
          </p>
        </div>
        <Button variant="outline" onClick={() => setResetOpen(true)}>
          <RotateCcw size={15} />
          Reset demo
        </Button>
      </section>
      <Modal
        open={resetOpen}
        onOpenChange={setResetOpen}
        title="Start fresh?"
        description="This restores the original 24 sample customers and default workspace preferences. Any customers you added in this browser will be removed."
      >
        <div className="form-actions">
          <Button variant="outline" onClick={() => setResetOpen(false)}>
            Keep my changes
          </Button>
          <Button
            onClick={() => {
              reset();
              setResetOpen(false);
            }}
          >
            Reset demo workspace
          </Button>
        </div>
      </Modal>
    </div>
  );
}
