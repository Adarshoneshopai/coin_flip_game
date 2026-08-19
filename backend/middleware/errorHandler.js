export const notFound = (req, res, next) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  // Only expose messages from errors we deliberately raised with a status
  // (validation, auth, etc.) — unhandled 500s may carry raw driver/internal
  // details (e.g. Mongoose timeouts) that shouldn't reach the client.
  const message =
    status < 500 && err.message
      ? err.message
      : "Something went wrong on our end. Please try again shortly.";
  res.status(status).json({ message });
};
