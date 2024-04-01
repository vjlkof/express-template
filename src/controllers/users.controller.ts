import { type Request, type Response, type NextFunction } from "express";
import { UsersServices } from "../services/users.services.js";
import { StatusCodes } from "http-status-codes";

export async function get(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const result = (await UsersServices.getData()).result;
    res.status(StatusCodes.OK).json(`hello users ${result}`);
    next();
  } catch (err) {
    next(err);
  }
}

export async function getOne(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id: string = req.params.id;
    const result = (await UsersServices.getOneData(id)).result;
    res.status(StatusCodes.OK).json(`hello users ${result}`);
    next();
  } catch (err) {
    next(err);
  }
}

export const UsersControllers = { get, getOne };
