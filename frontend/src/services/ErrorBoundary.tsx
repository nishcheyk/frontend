import React from "react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";

const ErrorFallback: React.FC<{ error: Error | null }> = ({ error }) => (
  <div
    role="alert"
    style={{ padding: 20, backgroundColor: "#fee", color: "#900" }}
  >
    <p>Something went wrong:</p>
    <pre>{error?.message}</pre>
  </div>
);

export const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <ReactErrorBoundary FallbackComponent={ErrorFallback}>
    {children}
  </ReactErrorBoundary>
);
