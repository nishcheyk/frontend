// src/ErrorFallback.tsx
import React from 'react';

type Props = {
  error: Error;
  resetErrorBoundary: () => void;
};

const ErrorFallback: React.FC<Props> = ({ error, resetErrorBoundary }) => (
  <div role="alert" style={{ padding: 20, backgroundColor: 'pink', color: 'darkred' }}>
    <p>Something went wrong! 😥</p>
    <pre>{error.message}</pre>
    <button onClick={resetErrorBoundary}>Try again</button>
  </div>
);

export default ErrorFallback;
