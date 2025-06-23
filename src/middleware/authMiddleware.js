const allowedUserIds = process.env.LINE_ALLOWED_USER_IDS;

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

function isUserAllowed(userId) {
  return allowedUserIds.includes(userId);
}

module.exports = { restrictToOwner, isUserAllowed };
