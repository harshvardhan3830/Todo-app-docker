import { hashPassword, comparePassword } from "../../helpers/bcryptHelper.js";
import { User } from "./users.mod.js";
import { handleError, ErrorTypes } from "../../helpers/errorHandler.js";
import jwt from "jsonwebtoken";
export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).send({
        message: "All fields are required",
        status: false,
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({ name, email, password: hashedPassword });
    res.status(201).send({
      message: "User created successfully",
      status: "success",
      user,
    });
  } catch (error) {
    console.error("Error creating user", error);
    handleError(
      res,
      ErrorTypes.INTERNAL_SERVER.code,
      "Error creating user",
      error
    );
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({
        message: "All fields are required",
        status: false,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({
        message: "User not found",
        status: false,
      });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).send({
        message: "Invalid password",
        status: false,
      });
    }

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign({ user }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    delete user.password;

    res.status(200).send({
      message: "User logged in successfully",
      status: "success",
      user,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Error logging in user", error);
    handleError(
      res,
      ErrorTypes.INTERNAL_SERVER.code,
      "Error logging in user",
      error
    );
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).send({
        message: "User not found",
        status: false,
      });
    }

    res.status(200).send({
      message: "User found successfully",
      status: "success",
      user,
    });
  } catch (error) {
    console.error("Error getting user", error);
    handleError(
      res,
      ErrorTypes.INTERNAL_SERVER.code,
      "Error getting user",
      error
    );
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).send({
        message: "All fields are required",
        status: false,
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.findByIdAndUpdate(
      id,
      { name, email, password: hashedPassword },
      { new: true }
    );
    if (!user) {
      return res.status(400).send({
        message: "User not found",
        status: false,
      });
    }
    return res.status(200).send({
      message: "User updated successfully",
      status: "success",
      user,
    });
  } catch (error) {
    console.error("Error updating user", error);
    handleError(
      res,
      ErrorTypes.INTERNAL_SERVER.code,
      "Error updating user",
      error
    );
  }
};

export const deleteUser = async (req, res) => {
  try {
  } catch (error) {}
};

export const getAllUsers = async (req, res) => {
  try {
  } catch (error) {}
};

// refresh token
export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(400).send({
        message: "User not found",
        status: false,
      });
    }

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const newRefreshToken = jwt.sign({ user }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).send({
      message: "Token refreshed successfully",
      status: "success",
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    console.error("Error refreshing token", error);
    handleError(
      res,
      ErrorTypes.INTERNAL_SERVER.code,
      "Error refreshing token",
      error
    );
  }
};
