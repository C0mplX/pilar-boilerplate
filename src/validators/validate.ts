import {Response} from "express";
import {ErrorResponse} from "pilar-server";

export function validate<T>(data: T, validateFunction: (data: T) => string[], res: Response): void {
  const errors = validateFunction(data);
  if(errors.length > 0) {
    res.status(400).json(new ErrorResponse(400, {message: errors}));
  }
}

export const isEmptyString = (data: string) => {
  return data === undefined || data === "";
};