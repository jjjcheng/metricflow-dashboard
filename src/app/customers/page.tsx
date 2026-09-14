import { Suspense } from "react";
import { Customers } from "@/components/customers";
import Loading from "../loading";
export const metadata = { title: "Customers" };
export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <Customers />
    </Suspense>
  );
}
