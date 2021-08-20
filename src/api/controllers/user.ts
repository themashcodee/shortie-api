import { NextFunction, Request, Response } from "express";
import schema from "../validations/joi";
import { resHandler } from "../helpers/resHandler";
import User from "../models/user";
const bcrypt = require("bcrypt");
import { createTokens } from "../helpers/createTokens";
import { recreateAccessToken } from "../helpers/recreateAccessToken";
const jwt = require("jsonwebtoken");

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await schema.validateAsync(req.body);
    const { email, password } = req.body;

    const isUser = await User.findOne({ email: email });
    if (isUser) return resHandler(res, 400, "User Already Exist");

    const hashPswd = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      password: hashPswd,
    });

    await newUser.save();
    resHandler(res, 200, "User Registered");
  } catch (err) {
    if (err.details[0].message)
      return resHandler(res, 400, err.details[0].message);
    resHandler(res, 500, "Server Error");
  }
};

export const signin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await schema.validateAsync(req.body);
    const { email, password } = req.body;

    const isUser = await User.findOne({ email: email });
    if (!!!isUser) return resHandler(res, 400, "Wrong email or password");

    const isPasswordSame = await bcrypt.compare(password, isUser.password);
    if (!isPasswordSame) return resHandler(res, 400, "Wrong email or password");

    const { accessToken, refreshToken } = createTokens(isUser._id);

    res.cookie("refreshToken", refreshToken, {
      expires: new Date(Date.now() + 60000 * 60 * 24 * 30),
      secure: true,
      httpOnly: true,
      sameSite: "none",
    });

    resHandler(res, 200, "User Logged In", { accessToken });
  } catch (err) {
    resHandler(res, 400, err.details[0].message);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.cookies.refreshToken)
    return resHandler(res, 401, "You are not Authorised");

  const data = await jwt.verify(
    req.cookies.refreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );
  const newAccessToken = recreateAccessToken(data.payload);
  resHandler(res, 200, "Token Regenerated", { accessToken: newAccessToken });
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("refreshToken");
  resHandler(res, 200, "Successfully Logged Out");
};
