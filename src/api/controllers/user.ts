import { NextFunction, Request, Response } from "express";
import schema from "../validations/joi";
import { resHandler } from "../helpers/resHandler";
import User from "../models/user";
const bcrypt = require("bcrypt");
import { createTokens } from "../helpers/createTokens";

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
    resHandler(res, 400, "Email or Password format is not appropriate");
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
    if (!!!isUser) return resHandler(res, 400, "User Doesn't Exist");

    const isPasswordSame = await bcrypt.compare(password, isUser.password);
    if (!isPasswordSame) return resHandler(res, 400, "Wrong email or password");

    const { accessToken, refreshToken } = createTokens(isUser._id);

    res.setHeader("authorization", `Bearer ${accessToken}`);
    res.cookie("refreshToken", refreshToken, {
      expires: new Date(Date.now() + 60000 * 60 * 24 * 30),
      secure: true, // uncomment in production
      httpOnly: true,
    });

    resHandler(res, 200, "User Logged In", { accessToken, refreshToken });
  } catch (err) {
    resHandler(res, 400, "Email or Password format is not appropriate");
  }
};
