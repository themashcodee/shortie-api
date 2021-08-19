const jwt = require("jsonwebtoken");
require("dotenv").config();
import { sign } from "jsonwebtoken";

export const createTokens = (payload: String) => {
  const accessToken: typeof sign = jwt.sign(
    { payload },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: 60 * 15,
    }
  );
  const refreshToken: typeof sign = jwt.sign(
    { payload },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "60d",
    }
  );
  return {
    accessToken,
    refreshToken,
  };
};
