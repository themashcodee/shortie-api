import crypto from "node:crypto";

export function tokens() {
  const accessTokenSecret = crypto.randomBytes(256).toString("base64");
  const refreshTokenSecret = crypto.randomBytes(256).toString("base64");
  console.log(accessTokenSecret);
  console.log(refreshTokenSecret);
}
