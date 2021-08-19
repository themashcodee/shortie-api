const jwt = require("jsonwebtoken");
require("dotenv").config();
import { sign } from "jsonwebtoken";

export const recreateAccessToken = (payload: string) => {
  const accessToken: typeof sign = jwt.sign(
    { payload },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: 60 * 15,
    }
  );
  return accessToken;
};
