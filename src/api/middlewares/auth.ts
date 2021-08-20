import { Request, Response, NextFunction } from "express";
import { resHandler } from "../helpers/resHandler";
const jwt = require("jsonwebtoken");

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.headers.authorization)
      return resHandler(res, 401, "You are not Authorised");

    const token = req.headers.authorization.split(" ")[1];
    const data = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    req.payload = data.payload;
    next();
  } catch (err) {
    console.log(err);
    resHandler(res, 401, "You are not Authorised");
  }
};
