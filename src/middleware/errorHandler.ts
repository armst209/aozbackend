import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import config from "config";

export const errorHandler: ErrorRequestHandler = (
  error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  res.status(statusCode);

  res.send({
    message: error.message,
    stack:
      config.get<string>("environment") === "production" ? null : error.stack,
  });
};
