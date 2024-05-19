import {
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
  patchIsBiz,
  getAllUsers,
  getUserById,
} from "../model/dbAdapter.js";
import handleError from "../utils/handleError.js";
import { generateHash, cmpHash } from "../utils/bcrypt.js";
import { generateToken } from "../token/jwt.js";
import db from "../db.js";

const getAllUsersController = async (req, res) => {
  try {
    let users = await getAllUsers();
    res.json(users);
  } catch (err) {
    console.log(err);
  }
};

const getUserByIdController = async (req, res) => {
  try {
    let user = await getUserById(req.params.id);
    res.json(user);
  } catch (err) {
    console.log(err);
  }
};
const registerController = async (req, res) => {
  try {
    let userFromDB = await db.getUserByEmail(req.body.email);
    if (userFromDB) {
      throw new Error("User already exists");
    }

    const password = req.body.password;
    const hashedPassword = await generateHash(password);
    let newUser = {
      ...req.body,
      password: hashedPassword,
      isAdmin: false,
    };

    const createdUser = await db.createUser(newUser);
    res.status(201).json(createdUser);
  } catch (err) {
    console.error("Registration error:", err);
    res.status(400).json({ message: err.message });
  }
};

const loginController = async (req, res) => {
  try {
    const email = req.body.email;
    let userFromDB = await db.getUserByEmail(email);

    if (!userFromDB) throw new Error("invalid email or password");

    let isPasswordMatch = await cmpHash(req.body.password, userFromDB.password);
    if (!isPasswordMatch) {
      throw new Error("invalid email or password");
    }

    let token = await generateToken({
      _id: userFromDB._id,
      isAdmin: userFromDB.isAdmin,
      isBusiness: userFromDB.isBusiness,
    });
    res.json(token);
  } catch (err) {
    console.log(err);
    handleError(res, 400, err.message);
  }
};

const updateUserController = async (req, res) => {
  try {
    let userFromDB = await updateUser(req.params.id, req.body);
    userFromDB.password = undefined;
    res.json(userFromDB);
  } catch (err) {
    console.log(err);
    handleError(res, 400, err.message);
  }
};

const patchUserController = async (req, res) => {
  try {
    const updates = req.body;
    const updatedUser = await patchIsBiz(req.params.id, updates);
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(updatedUser);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(400).json({ message: err.message });
  }
};

const deleteUserController = async (req, res) => {
  try {
    let userFromDB = await deleteUser(req.params.id);
    userFromDB.password = undefined;
    res.json(userFromDB);
  } catch (err) {
    console.log(err);
    handleError(res, 400, err.message);
  }
};

export {
  loginController,
  registerController,
  updateUserController,
  deleteUserController,
  patchUserController,
  getAllUsersController,
  getUserByIdController,
};
