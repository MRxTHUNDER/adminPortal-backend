import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/UserModel";
import { Interviewer } from "../models/InterviewerModel";
import AdminModel, { Admin } from "../models/Admin";

declare module "express-serve-static-core" { //explicity defining the User and interviewer schema for _id
  interface Request {
    user?: (
      | (import("mongoose").Document<unknown, {}, User> & User & { _id: unknown })
      | (import("mongoose").Document<unknown, {}, Interviewer> &
          Interviewer & { _id: unknown })
      | (import("mongoose").Document<unknown, {}, Admin> & Admin & { _id: unknown })
    );
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(403).json({
      message: "No token provided",
    });
    return;
  }

  if (!process.env.JWT_SECRET) {
    res.status(500).json({
      message: "Internal server error: Missing JWT secret",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string; role?: string };
    const { id } = decoded;

    let user;
   
    user = await AdminModel.findById(id);

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    req.user = user; 
    next();
  } catch (error) {
    res.status(403).json({
      message: "Invalid token",
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return;
  }
};
