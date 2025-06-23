require("dotenv").config();

const allowedUserIds = process.env.LINE_ALLOWED_USER_IDS
  ? process.env.LINE_ALLOWED_USER_IDS.split(",")
  : [];

console.log(allowedUserIds);

module.exports = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET,
  allowedUserIds,
};
