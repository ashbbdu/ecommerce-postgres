import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

import jwt from "jsonwebtoken"
require("dotenv").config()

const prisma = new PrismaClient()

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token =
      req?.body?.token || req?.header("Authorization")?.replace("Bearer ", "");


    if (!token) {
      return res.status(401).json({ success: false, message: "Token Missing" });
    }

    try {
      const decode = await jwt.verify(token, "secret");
      req.body.user = decode;
    } catch (error) {
      return res
        .status(401)
        .json({ success: false, message: "Token is invalid" });
    }

    next();
  } catch (error) {

    return res.status(401).json({
      success: false,
      message: "Please login to perform this action",
    });
  }
};

export const isUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userDetails = await prisma.user.findUnique({
      where: {
        // auth k sath chlega is liye email isko mil jaega
        email: req.body.user.email
      }
    });

    if (!userDetails?.isAdmin) {
      return res.status(401).json({
        success: false,
        message: "This is a Protected Route for Users",
      });
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `User Role Can't be Verified` });
  }
};

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userDetails = await prisma.user.findUnique({
      where: {
        // auth k sath chlega is liye email isko mil jaega
        email: req.body.user.email
      }
    });


    if (userDetails?.isAdmin) {
      return res.status(401).json({
        success: false,
        message: "This is a Protected Route for Admin",
      });
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `User Role Can't be Verified` });
  }
};
