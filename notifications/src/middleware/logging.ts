import { Logger } from "log4u";
import { Request, Response, NextFunction } from "express";

const log4u = new Logger({ serviceName: "Notification" });

declare global {
  namespace Express {
    interface Request {
      log4u?: Logger;
    }
  }
}

export const log4uMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.log4u = log4u;
  next();
};
