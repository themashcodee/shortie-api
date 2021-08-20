import { Request, Response } from "express";
import { resHandler } from "../helpers/resHandler";
import { nanoid } from "nanoid";
import User from "../models/user";

export const userDetails = async (req: Request, res: Response) => {
  const user = await User.findOne({ _id: req.payload });
  resHandler(res, 200, "Here is the User all details", { user });
};

export const addOne = async (req: Request, res: Response) => {
  if (!req.body.url) return resHandler(res, 400, "Url missing in body");
  try {
    const user = await User.findOne({ _id: req.payload });
    const links = user?.links;
    const longUrl = req.body.url;
    const realUrl = process.env.REAL_URL;

    creation();
    async function creation() {
      const shortId = nanoid(6);
      const shortUrl = `${realUrl}/${shortId}`;
      const dublicate = shortUrl;

      const isUrlExist = await User.findOne({
        links: { $elemMatch: { shortUrl: dublicate } },
      });

      if (isUrlExist) {
        creation();
      } else {
        links?.push({ shortUrl, longUrl });
        await user?.save();
        resHandler(res, 200, "Short Url created", { shortUrl });
      }
    }
  } catch (err) {
    console.log(err);
    resHandler(res, 500, "Server Error");
  }
};

export const visitUrl = async (req: Request, res: Response) => {
  try {
    const url = `${process.env.REAL_URL}/${req.params.shortId}`;
    const user = await User.findOne({
      links: { $elemMatch: { shortUrl: url } },
    });
    const data = user?.links?.find((element) => element.shortUrl === url)!;
    data.visits!++;
    await user?.save();
    res.redirect(data.longUrl);
  } catch (err) {
    console.log(err);
    resHandler(res, 404, "Page doesn't exist");
  }
};

export const deleteOne = async (req: Request, res: Response) => {
  if (!req.body.url) return resHandler(res, 400, "Url missing in body");

  const urlToDel = req.body.url;
  const user = await User.findOne({
    _id: req.payload,
    links: { $elemMatch: { shortUrl: urlToDel } },
  });
  if (!user)
    return resHandler(
      res,
      400,
      "Url doesn't exist or you are not the owner of url"
    );

  const ind = user.links!.findIndex((url) => {
    return url.shortUrl === urlToDel;
  });
  user.links!.splice(ind, 1);

  await user.save();
  resHandler(res, 200, "Url has deleted");
};

export const updateOne = async (req: Request, res: Response) => {
  if (!req.body.shortUrl || !req.body.longUrl)
    return resHandler(res, 400, "Url missing in body");

  try {
    const user = await User.findOne({
      _id: req.payload,
      links: { $elemMatch: { shortUrl: req.body.shortUrl } },
    });

    if (!user)
      return resHandler(
        res,
        400,
        "Url doesn't exist or you are not the owner of url"
      );

    const ind = user.links!.findIndex(
      (url) => url.shortUrl === req.body.shortUrl
    );
    user.links![ind].longUrl = req.body.longUrl;
    await user.save();

    resHandler(res, 200, "Url Updated");
  } catch (err) {
    console.log(err);
    resHandler(res, 500, "Server Error");
  }
};
