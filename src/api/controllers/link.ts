import { Request, Response } from "express";
import { resHandler } from "../helpers/resHandler";

export const getAll = async (req: Request, res: Response) => {
  resHandler(res, 200, "You are verified user");
};
