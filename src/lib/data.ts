export type Plan = "Starter" | "Pro" | "Business";
export type CustomerStatus = "Active" | "Trial" | "Canceled";
export type Customer = {
  id: string;
  name: string;
  email: string;
  company: string;
  plan: Plan;
  status: CustomerStatus;
  joined: string;
  color: string;
};
export type Settings = {
  name: string;
  email: string;
  workspace: string;
  website: string;
  revenueAlerts: boolean;
  weeklyDigest: boolean;
  productUpdates: boolean;
};
export const prices: Record<Plan, number> = {
  Starter: 29,
  Pro: 79,
  Business: 199,
};
export const initialSettings: Settings = {
  name: "Alex Morgan",
  email: "alex@acme.studio",
  workspace: "Acme Studio",
  website: "https://acme.studio",
  revenueAlerts: true,
  weeklyDigest: true,
  productUpdates: false,
};
const people = [
  ["Olivia Rhye", "olivia@layers.design", "Layers", "Pro", "Active"],
  ["Phoenix Baker", "phoenix@sisyphus.com", "Sisyphus", "Business", "Active"],
  ["Lana Steiner", "lana@catalog.studio", "Catalog", "Starter", "Trial"],
  ["Demi Wilkinson", "demi@quotient.co", "Quotient", "Pro", "Active"],
  ["Drew Cano", "drew@circooles.com", "Circooles", "Business", "Active"],
  ["Natali Craig", "natali@hourglass.app", "Hourglass", "Starter", "Canceled"],
  ["Orlando Diggs", "orlando@commandr.io", "Command+R", "Pro", "Active"],
  ["Andi Lane", "andi@capsule.so", "Capsule", "Pro", "Active"],
  ["Kate Morrison", "kate@nietzsche.io", "Nietzsche", "Business", "Active"],
  ["Koray Okumus", "koray@recharge.design", "Recharge", "Starter", "Trial"],
  ["Sienna Hewitt", "sienna@mintlify.com", "Mintlify", "Pro", "Active"],
  ["Noah Williams", "noah@luminous.io", "Luminous", "Business", "Active"],
  ["Mia Chen", "mia@wildwood.co", "Wildwood", "Starter", "Active"],
  ["Liam Patel", "liam@orbit.studio", "Orbit", "Pro", "Active"],
  ["Emma Wilson", "emma@feather.app", "Feather", "Pro", "Trial"],
  ["Oliver Kim", "oliver@lightbox.so", "Lightbox", "Business", "Active"],
  ["Ava Thompson", "ava@northstar.co", "Northstar", "Starter", "Active"],
  ["Ethan Davis", "ethan@outline.io", "Outline", "Pro", "Canceled"],
  ["Isabella Garcia", "isabella@aperture.co", "Aperture", "Business", "Active"],
  ["Lucas Brown", "lucas@waypoint.app", "Waypoint", "Starter", "Active"],
  ["Amelia Clark", "amelia@bloom.so", "Bloom", "Pro", "Active"],
  ["James Lewis", "james@tandem.co", "Tandem", "Business", "Active"],
  ["Charlotte Lee", "charlotte@vellum.io", "Vellum", "Pro", "Trial"],
  ["Benjamin Hall", "benjamin@horizon.co", "Horizon", "Starter", "Active"],
];
export const initialCustomers: Customer[] = people.map((p, i) => ({
  id: `CUS-${String(1024 - i)}`,
  name: p[0],
  email: p[1],
  company: p[2],
  plan: p[3] as Plan,
  status: p[4] as CustomerStatus,
  joined: `2026-05-${String(31 - i).padStart(2, "0")}`,
  color: ["lilac", "peach", "mint", "pink", "blue", "sand"][i % 6],
}));
export type Invoice = {
  id: string;
  customerId: string;
  name: string;
  email: string;
  plan: Plan;
  amount: number;
  date: string;
  status: "Paid" | "Pending" | "Overdue";
};
export const invoices: Invoice[] = initialCustomers
  .slice(0, 18)
  .map((c, i) => ({
    id: `INV-2026-${String(128 - i).padStart(4, "0")}`,
    customerId: c.id,
    name: c.name,
    email: c.email,
    plan: c.plan,
    amount: prices[c.plan],
    date: c.joined,
    status: i === 5 ? "Overdue" : i % 5 === 2 ? "Pending" : "Paid",
  }));
export const ranges = {
  "30d": {
    label: "May 1 – May 31, 2026",
    short: "This month",
    revenue: 48295,
    previous: 42180,
    customers: 1248,
    growth: "12.8",
    churn: "2.4",
    bars: [
      24, 31, 28, 42, 37, 33, 45, 49, 39, 46, 55, 48, 44, 59, 52, 68, 61, 54,
      66, 63, 76, 67, 72, 62, 78, 70, 83, 76, 87, 80, 93,
    ],
  },
  "7d": {
    label: "May 25 – May 31, 2026",
    short: "Last 7 days",
    revenue: 12940,
    previous: 11330,
    customers: 1248,
    growth: "3.2",
    churn: "0.6",
    bars: [42, 55, 46, 61, 58, 76, 68],
  },
  "90d": {
    label: "Mar 1 – May 31, 2026",
    short: "Last 3 months",
    revenue: 132860,
    previous: 116420,
    customers: 1248,
    growth: "12.4",
    churn: "3.1",
    bars: [
      20, 28, 24, 36, 31, 45, 38, 47, 52, 46, 56, 63, 54, 64, 60, 73, 67, 78,
      70, 89, 81, 95,
    ],
  },
};
export type Range = keyof typeof ranges;
export function revenueSeries(range: Range) {
  const r = ranges[range];
  const sum = r.bars.reduce((a, b) => a + b, 0);
  let used = 0;
  return r.bars.map((v, i) => {
    const revenue =
      i === r.bars.length - 1
        ? r.revenue - used
        : Math.round((v / sum) * r.revenue);
    used += revenue;
    return {
      label:
        range === "90d"
          ? `Week segment ${i + 1}`
          : `May ${range === "7d" ? i + 25 : i + 1}`,
      revenue,
    };
  });
}
