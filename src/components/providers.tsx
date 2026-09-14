"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useSyncExternalStore,
} from "react";
import { ThemeProvider } from "next-themes";
import { CheckCircle2, X, AlertCircle } from "lucide-react";
import {
  initialCustomers,
  initialSettings,
  type Customer,
  type Settings,
} from "@/lib/data";
type Store = {
  customers: Customer[];
  setCustomers: (value: Customer[]) => void;
  settings: Settings;
  saveSettings: (value: Settings) => void;
  ready: boolean;
  notify: (message: string) => void;
  reset: () => void;
};
const Context = createContext<Store | null>(null);
const STORAGE_KEY = "metricflow-workspace-v1";
const serverSnapshot = {
  customers: initialCustomers,
  settings: initialSettings,
  ready: false,
  storageError: false,
};
let snapshot = serverSnapshot;
const listeners = new Set<() => void>();
function validCustomer(value: unknown): value is Customer {
  if (!value || typeof value !== "object") return false;
  const c = value as Customer;
  return (
    ["id", "name", "email", "company", "joined", "color"].every(
      (k) => typeof c[k as keyof Customer] === "string",
    ) &&
    ["Starter", "Pro", "Business"].includes(c.plan) &&
    ["Active", "Trial", "Canceled"].includes(c.status)
  );
}
function readStorage() {
  let next = { ...serverSnapshot, ready: true };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (Array.isArray(data.customers) && data.customers.every(validCustomer))
        next.customers = data.customers;
      if (
        data.settings &&
        Object.entries(initialSettings).every(
          ([k, v]) => typeof data.settings[k] === typeof v,
        )
      )
        next.settings = data.settings;
    }
  } catch {
    next = { ...next, storageError: true };
  }
  snapshot = next;
}
function getSnapshot() {
  if (!snapshot.ready && typeof window !== "undefined") readStorage();
  return snapshot;
}
function getServerSnapshot() {
  return serverSnapshot;
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) {
      readStorage();
      listeners.forEach((fn) => fn());
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}
function update(next: Partial<typeof snapshot>) {
  snapshot = { ...getSnapshot(), ...next };
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        customers: snapshot.customers,
        settings: snapshot.settings,
      }),
    );
  } catch {
    snapshot = { ...snapshot, storageError: true };
  }
  listeners.forEach((fn) => fn());
}
export function Providers({ children }: { children: React.ReactNode }) {
  const data = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [toast, setToast] = useState("");
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 4200);
    return () => clearTimeout(timer);
  }, [toast]);
  const notify = useCallback((message: string) => setToast(message), []);
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <Context.Provider
        value={{
          customers: data.customers,
          setCustomers: (value) => update({ customers: value }),
          settings: data.settings,
          saveSettings: (value) => update({ settings: value }),
          ready: data.ready,
          notify,
          reset: () => {
            update({ customers: initialCustomers, settings: initialSettings });
            notify("Demo workspace has been reset.");
          },
        }}
      >
        {children}
        {data.storageError && (
          <div className="storage-note" role="status">
            <AlertCircle size={15} /> Browser storage is unavailable. Changes
            may not persist after this session.
          </div>
        )}
        {toast && (
          <div className="toast" role="status">
            <CheckCircle2 size={19} />
            <span>{toast}</span>
            <button
              onClick={() => setToast("")}
              aria-label="Dismiss notification"
            >
              <X size={15} />
            </button>
          </div>
        )}
      </Context.Provider>
    </ThemeProvider>
  );
}
export function useWorkspace() {
  const value = useContext(Context);
  if (!value) throw new Error("Workspace provider missing");
  return value;
}
