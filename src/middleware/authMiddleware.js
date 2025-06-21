const allowedUserId = process.env.LINE_ALLOWED_USER_ID;

function restrictToOwner(req, res, next) {
  const events = req.body.events || [];
  for (const event of events) {
    if (event.source?.userId !== allowedUserId) {
      // Ignore events from other users
      return res.status(403).send("Forbidden");
    }
  }
  next();
}

module.exports = restrictToOwner;
