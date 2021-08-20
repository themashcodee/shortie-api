import { Response, Request, Application } from "express";
import userRoute from "./user";
import linkRoute from "./link";
import { auth } from "../middlewares/auth";
import { visitUrl } from "../controllers/link";

const routes = (app: Application, base: string): void => {
  // HEALTH
  app.get(`${base}/health`, (req: Request, res: Response) =>
    res.status(200).send("Good")
  );

  // VISIT URL
  app.get("/:shortId", visitUrl);

  // USER ROUTES
  app.use(`${base}/auth`, userRoute);

  // MAIN API ROUTES
  app.use(`${base}/link`, auth, linkRoute);

  // 404
  app.use((req: Request, res: Response) =>
    res.status(404).send("Page not found")
  );
};

export default routes;
