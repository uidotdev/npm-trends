import React from 'react';
import { PropTypes } from 'prop-types';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

const propTypes = {
  children: PropTypes.node,
};

const ErrorBoundary = ({ children }) => {
  const errorFallback = ({ error }) => (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
    </div>
  );

  const handleError = (error, { componentStack }) => {
    console.log(error);
    console.log(componentStack);
  };

  return (
    <ReactErrorBoundary FallbackComponent={errorFallback} onError={handleError}>
      {children}
    </ReactErrorBoundary>
  );
};

ErrorBoundary.propTypes = propTypes;

export default ErrorBoundary;
