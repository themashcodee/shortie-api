import { Request, Response, NextFunction } from "express";
import { resHandler } from "../helpers/resHandler";
const jwt = require("jsonwebtoken");
import { recreateAccessToken } from "../helpers/recreateAccessToken";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log(req.headers);
    if (!req.headers.authorization) {
      console.log(req.cookies);
      if (req.cookies.refreshToken) {
        const data = await jwt.verify(
          req.cookies.refreshToken,
          process.env.REFRESH_TOKEN_SECRET
        );
        const newAccessToken = recreateAccessToken(data.payload);
        res.set("Authorization", `Bearer ${newAccessToken}`);
        console.log("by refresh token");
        return next();
      }
      console.log("becuz have nthg");
      return resHandler(res, 401, "You are not Authorised");
    }

    const token = req.headers.authorization.split(" ")[1];
    console.log("by access token");
    await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    next();
  } catch (err) {
    console.log(err);
    resHandler(res, 401, "You are not Authorised");
  }
};
