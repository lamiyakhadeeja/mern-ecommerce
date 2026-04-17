export function errorHandler(err, _req, res, _next) {
  let status = err.statusCode || err.status || 500;
  let message = err.message || "Internal Server Error";

  if (err.name === "ValidationError") {
    status = 400;
    message = Object.values(err.errors || {})
      .map((e) => e.message)
      .join(". ");
  } else if (err.code === 11000) {
    status = 400;
    const dup = err.keyPattern || err.keyValue || {};
    const key = Object.keys(dup)[0] || "field";
    message = `Duplicate value for ${key}`;
  } else if (err.name === "CastError") {
    status = 400;
    message = `Invalid ${err.path || "id"}`;
  }

  res.status(status).json({ message, ...(process.env.NODE_ENV === "development" && { stack: err.stack }) });
}
