import {NextFunction, Request, Response} from 'express'
import jwt from 'jsonwebtoken';
import {ErrorResponse} from "pilar-server";
import User from "../models/User";
import dotenv from 'dotenv';
if (process.env.NODE_ENV === 'dev') {
  dotenv.config();
}

const jwtSecret = process.env.JWT_SECRET || 'C8DC1841-ACA3-4DA0-920E-6E4C246C46E6';

export interface IExtendedResponse extends Response {
  tokenData: ITokenBody;
}

interface IAuthMiddleware {
  req: Request,
  res: IExtendedResponse,
  next: NextFunction,
}

export const authMiddleware = (req: Request, res: IExtendedResponse, next: NextFunction) => {
  if (!req.headers.authorization) {
    return res.status(403).json(new ErrorResponse(403, {message: 'MISSING_AUTH_HEADER'}));
  }
  const parts = req.headers.authorization.split(' ');
  if (parts.length === 2) {
    const scheme = parts[0];
    const token = parts[1];
    if (/^Bearer$/i.test(scheme)) {
      const decodedToken = validateToken(token, TokenType.ACCESS_TOKEN);
      if (decodedToken) {
        res.tokenData = decodedToken;
        next();
        return;
      }
      return res.status(401).json(new ErrorResponse(401, {message: "INVALID_TOKEN"}));
    } else {
      return res.status(401).json(new ErrorResponse(401, {message: "MISSING_BEARER"}));
    }
  } else {
    return res.status(401).json(new ErrorResponse(401, {message: "WRONG_FORMAT_ON_HEADER"}));
  }
};

export const longLivedAuthMiddleWare = (req: Request, res: IExtendedResponse, next: NextFunction) => {
  if (!req.headers.authorization) {
    return res.status(403).json(new ErrorResponse(403, {message: 'MISSING_AUTH_HEADER'}));
  }
  const parts = req.headers.authorization.split(' ');
  if (parts.length === 2) {
    const scheme = parts[0];
    const token = parts[1];
    if (/^Bearer$/i.test(scheme)) {
      const decodedToken = validateToken(token, TokenType.LONG_LIVED_TOKEN);
      if (decodedToken) {
        res.tokenData = decodedToken;
        next();
        return;
      }
      return res.status(401).json(new ErrorResponse(401, {message: "INVALID_TOKEN"}));
    }else {
      return res.status(401).json(new ErrorResponse(401, {message: "MISSING_BEARER"}));
    }
  }
};

export enum TokenType {
  ACCESS_TOKEN = "ACCESS_TOKEN",
  LONG_LIVED_TOKEN = "LONG_LIVED_TOKEN"
}

interface ITokenBody {
  data: {
    type: TokenType;
    payload: any;
  }
}

export const issueAccessToken = (longLivedToken: string, payload: Pick<User, 'id' | 'email'>) => {
  try {
    const decodedLongLivedToken: any = jwt.verify(longLivedToken, jwtSecret);
    if (decodedLongLivedToken.data.type === TokenType.LONG_LIVED_TOKEN
      && decodedLongLivedToken.data.payload.email === payload.email
    ) {
      return jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 5),
        data: {
          type: TokenType.ACCESS_TOKEN,
          payload
        },
      }, jwtSecret);
    } else {
      return false;
    }
  } catch (e) {
    console.log(e);
    return false;
  }
};

export const issueLongLivedToken = (payload: Pick<User, 'id' | 'email'>) => {
  return jwt.sign({
    exp: Math.floor(Date.now() / 1000) + (60 * 36000),
    data: {
      type: TokenType.LONG_LIVED_TOKEN,
      payload
    },
  }, jwtSecret);
};

export const validateToken = (token: string, type: TokenType) => {
  try {
    const decodedToken = jwt.verify(token, jwtSecret) as ITokenBody;
    if (decodedToken && decodedToken.data.type === type) {
      return decodedToken;
    }
  } catch (e) {
    console.log(e);
    return false;
  }
};