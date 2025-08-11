import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const EventDetailsSkeleton = () => {
  return (
    <div style={{ maxWidth: 500, margin: "0 auto" }}>
      <Skeleton height={40} width={300} style={{ marginBottom: 15 }} />
      <Skeleton count={3} style={{ marginBottom: 10 }} />
      <Skeleton height={30} width={150} style={{ marginBottom: 10 }} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(10, 40px)",
          gap: 8,
          marginBottom: 15,
        }}
      >
        {Array(10)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} height={40} width={40} />
          ))}
      </div>

      <Skeleton height={40} width={120} />
    </div>
  );
};
