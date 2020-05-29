import {Response} from "express";
import {ErrorResponse} from "pilar-server";

export const serverError = (res: Response, error: any) => {
  const isTest = process.env.NODE_ENV === "dev";
  res.status(500).json(new ErrorResponse(500, {message: "Server crashed"}, isTest ? error : null));
};