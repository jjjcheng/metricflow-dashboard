import Link from "next/link";
export default function NotFound() {
  return (
    <div className="empty-state">
      <span className="eyebrow">404 · A LITTLE OFF TRACK</span>
      <h1>This page isn’t in your workspace.</h1>
      <p>Let’s get you back to the bigger picture.</p>
      <Link href="/" className="btn btn-primary">
        Back to overview
      </Link>
    </div>
  );
}
