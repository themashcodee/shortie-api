import { Response, Request, NextFunction, Application } from "express";
import userRoute from "./user";
import linkRoute from "./link";
import { auth } from "../middlewares/auth";

const routes = (app: Application, base: string): void => {
  // HEALTH
  app.get("/health", (req: Request, res: Response) =>
    res.status(200).send("Good")
  );

  // USER ROUTE
  app.use(`${base}/auth`, userRoute);
  app.use(`${base}/link`, auth, linkRoute);

  // // ERROR HANDLING
  // app.use((err: any, req: Request, res: Response, next: NextFunction) =>
  //   res.status(err.status).json(err)
  // );

  // 404
  app.use((req: Request, res: Response) =>
    res.status(404).send("Page not found")
  );
};

export default routes;
