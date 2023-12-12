import fs from "fs/promises";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import Jimp from "jimp";
import { nanoid } from "nanoid";

import User from "../models/User.js";
import { ctrlWrapper } from "../decorators/index.js";
import { HttpError, sendEmail } from "../helpers/index.js";

const { JWT_SECRET, BASE_URL } = process.env;
const avatarPath = path.resolve("public", "avatars");

const register = async (req, res) => {
  const { email, password, username } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);
  const verificationToken = nanoid();
  const avatarURL = gravatar.url(email, {
    s: "250",
    d: "robohash",
    protocol: "https",
  });

  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<h2>Hello, ${username}</h2><img src="${avatarURL}"/><a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationToken}">Click verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    username: newUser.username,
    email: newUser.email,
    avatarURL: newUser.avatarURL,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  if (!user.verify) {
    throw HttpError(401, "Email not verify");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }
  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({ token, user: { email } });
};

const getCurrent = async (req, res) => {
  const { username, email } = req.user;

  res.json({ username, email });
};
const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.json({
    message: "Logout success",
  });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: oldPath, filename } = req.file;
  const newPath = path.join(avatarPath, filename);
  await fs.rename(oldPath, newPath);

  const image = await Jimp.read(newPath);
  await image.resize(250, 250).writeAsync(newPath);

  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, { avatarURL });
  res.status(201).json(avatarURL);
};

export default {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateAvatar: ctrlWrapper(updateAvatar),
};
