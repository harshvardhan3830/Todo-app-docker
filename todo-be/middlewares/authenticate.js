import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { ErrorTypes } from "../helpers/errorHandler.js";

dotenv.config();

const secretKey = process.env.JWT_SECRET;

export const authenticate = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(ErrorTypes.UNAUTHORIZED.code).json({
        status: "error",
        message: "Access Denied. No token provided.",
        data: null,
      });
    }

    // Extract token from Bearer format
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(ErrorTypes.UNAUTHORIZED.code).json({
        status: "error",
        message: "Invalid token format. Use Bearer token.",
        data: null,
      });
    }

    // Verify token
    const decoded = jwt.verify(token, secretKey);

    // Attach user to request
    req.user = decoded.user;

    // Continue to next middleware
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(ErrorTypes.UNAUTHORIZED.code).json({
        status: "error",
        message: "Token has expired. Please login again.",
        data: null,
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(ErrorTypes.UNAUTHORIZED.code).json({
        status: "error",
        message: "Invalid token. Please login again.",
        data: null,
      });
    }

    // For any other errors
    return res.status(ErrorTypes.INTERNAL_SERVER.code).json({
      status: "error",
      message: "Authentication failed.",
      data: null,
    });
  }
};
