export default function Loading() {
  return (
    <div className="page" aria-label="Loading dashboard" aria-busy="true">
      <div
        className="skeleton"
        style={{ width: 240, height: 36, marginBottom: 32 }}
      />
      <div className="stats-grid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton" style={{ height: 160 }} />
        ))}
      </div>
      <div className="skeleton" style={{ height: 350, marginTop: 24 }} />
    </div>
  );
}
