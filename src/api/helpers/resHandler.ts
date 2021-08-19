import { Response } from "express";

export const resHandler = (
  res: Response,
  statuscode: number,
  message: string,
  data?: {}
) => {
  return res.status(statuscode).json({
    status: statuscode,
    message,
    data,
  });
};
