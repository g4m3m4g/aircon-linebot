module.exports = function logMiddleware(req, res, next) {
  const message = req.body?.events?.[0]?.message?.text;

  if (message) {
    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        message: message,
      })
    );
  }

  next();
};
