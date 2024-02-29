const reportWebVitals = (onPerfEntry?: any): void => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals/attribution').then(
      ({ onCLS, onFID, onFCP, onLCP, onTTFB, onINP }) => {
        onCLS(onPerfEntry);
        onFID(onPerfEntry);
        onFCP(onPerfEntry);
        onLCP(onPerfEntry);
        onTTFB(onPerfEntry);
        onINP?.(onPerfEntry);
      },
    );
  }
};

export default reportWebVitals;
