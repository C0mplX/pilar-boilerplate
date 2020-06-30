import {Request, Response} from "express";
import {BaseRouter, ErrorResponse, IBaseRouter, SuccessResponse} from "pilar-server";
import {validate} from "../../validators/validate";
import {ILoginParams, ISignupParams, validateLoginParams, validateSignupParams} from "../../validators/userValidators";
import User from "../../models/User";
import bcryptjs from 'bcryptjs';
import {serverError} from "../../helpers";
import {
  authMiddleware,
  IExtendedResponse,
  issueAccessToken,
  issueLongLivedToken, longLivedAuthMiddleWare
} from "../../middlewares/authMiddleware";


class UserRoutes extends BaseRouter implements IBaseRouter {
  public readonly path = '/user';

  constructor() {
    super();
    this.initRoutes();
  }

  initRoutes(): any {
    this.router.post(`${this.path}/login`,  UserRoutes.login);
    this.router.post(`${this.path}/signup`, UserRoutes.signup);
    this.router.get(`${this.path}`, authMiddleware, UserRoutes.getUser);
    this.router.get(`${this.path}/issue-access-token`, longLivedAuthMiddleWare, UserRoutes.issueAccessToken);
  }

  private static async getUser(req: Request, res: IExtendedResponse) {
    try {
      const user = await User.findOne({where: {id: res.tokenData.data.payload.id}});
      res.send(new SuccessResponse(200, user));
    } catch (e) {
      serverError(res, e);
    }
  }

  private static async login(req: Request, res: Response) {
    const userData = req.body as ILoginParams;
    validate<ILoginParams>(userData, validateLoginParams, res, async () => {
      try {
        const existingUser = await User.scope("full").findOne({
          where: {email: userData.email}
        });
        if(existingUser) {
          return bcryptjs.compare(userData.password, existingUser.password, (err, result) => {
            if(err) {
              serverError(res, err);
            }
            if(result === true) {
              const tokenPayload = {id: existingUser.id, email: existingUser.email};
              const longLivedToken  = issueLongLivedToken(tokenPayload);
              const accessToken     = issueAccessToken(longLivedToken, tokenPayload);
              if(accessToken) {
                return res.send(new SuccessResponse(200, {accessToken, longLivedToken}));
              }
              return res.status(400).json(new ErrorResponse(401, {message: `INVALID_CREDENTIALS`}));
            }
            return res.status(400).json(new ErrorResponse(400, {message: `WRONG_PASSWORD`}));
          });
        }
        res.status(404).json(new ErrorResponse(404, {message: 'USER_NOT_FOUND'}));
      } catch (e) {
        serverError(res, e);
      }
    });
  }

  private static async signup(req: Request, res: Response) {
    const userData = req.body as ISignupParams;
    validate<ISignupParams>(userData, validateSignupParams, res, async () => {
      const existingUser = await User.findOne({where: {email: userData.email}});
      try {
        if(existingUser === null) {
          return bcryptjs.genSalt(10, (saltErr, salt) => {
            bcryptjs.hash(userData.password, salt, async (err, hash) => {
              userData.password = hash;
              const newUser = await User.create(userData);
              newUser.password = "";
              res.send(new SuccessResponse(200, {user: newUser}));
            });
          });
        }
        res.status(400).json(new ErrorResponse(400, {message: 'USER_EXISTS'}));
      } catch (e) {
        serverError(res, e);
      }
    });
  }

  private static async issueAccessToken(req: Request, res: IExtendedResponse) {
    try {
      const user = await User.findOne({where: {id: res.tokenData.data.payload.id}});
      if(user) {
        const tokenPayload = {id: user.id, email: user.email};
        const longLivedToken  = issueLongLivedToken(tokenPayload);
        const accessToken     = issueAccessToken(longLivedToken, tokenPayload);
        if(accessToken) {
          return res.send(new SuccessResponse(200, {accessToken, longLivedToken}));
        }
        return res.status(400).json(new ErrorResponse(401, {message: `INVALID_CREDENTIALS`}));
      }
    } catch (e) {
      serverError(res, e);
    }
  }
}

export default UserRoutes;