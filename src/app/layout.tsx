import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { Shell } from "@/components/shell";
import "@fontsource-variable/inter";
import "./globals.css";
export const metadata: Metadata = {
  title: { default: "Overview · MetricFlow", template: "%s · MetricFlow" },
  description:
    "A thoughtfully crafted SaaS workspace. Revenue analytics, customer management, subscriptions, and billing in one beautiful dashboard.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <Shell>{children}</Shell>
        </Providers>
      </body>
    </html>
  );
}
