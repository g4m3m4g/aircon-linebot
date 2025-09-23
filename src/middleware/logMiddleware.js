module.exports = function logMiddleware(req, res, next) {
  const logData = {
    timestamp: new Date().toISOString(),
    ip: req.ip || req.connection.remoteAddress,
    headers: req.headers,
    body: req.body?.events?.[0]?.message || null,
  };

  console.log("---- Incoming Webhook ----");
  console.log(JSON.stringify(logData, null, 4));
  console.log("--------------------------");

  next();
};
