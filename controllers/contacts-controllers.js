import fs from "fs/promises";
import path from "path";

import Contact from "../models/Contact.js";

import { ctrlWrapper } from "../decorators/index.js";

import { HttpError } from "../helpers/index.js";

const posterPath = path.resolve("public", "avatars");

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20, favorite } = req.query;
  const skip = (page - 1) * limit;

  const filterCriteria = { owner };
  if (favorite !== undefined) {
    filterCriteria.favorite = favorite;
  }

  const result = await Contact.find(filterCriteria, "-createdAt -updatedAt", {
    skip,
    limit,
  }).populate("owner", "username email");
  res.status(200).json(result);
};
const getById = async (req, res) => {
  const { _id: owner } = req.user;
  const { contactId } = req.params;
  const result = await Contact.findOne({ _id: contactId, owner });
  if (!result) {
    throw HttpError(404, `Contact with id=${contactId} not found`);
  }
  res.status(200).json(result);
};

const add = async (req, res) => {
  const { _id: owner } = req.user;
  const { path: oldPath, filename } = req.file;
  const newPath = path.join(posterPath, filename);
  await fs.rename(oldPath, newPath);
  const poster = path.join("avatars", filename);
  const result = await Contact.create({ ...req.body, poster, owner });
  res.status(201).json(result);
};

const updateById = async (req, res) => {
  const { _id: owner } = req.user;
  const { contactId } = req.params;
  const result = await Contact.findOneAndUpdate(
    { _id: contactId, owner },
    req.body
  );
  if (!result) {
    throw HttpError(404, `Contact with id=${contactId} not found`);
  }
  res.status(200).json(result);
};

const deleteById = async (req, res) => {
  const { _id: owner } = req.user;
  const { contactId } = req.params;
  const result = await Contact.findOneAndDelete({ _id: contactId, owner });
  if (!result) {
    throw HttpError(404, `Contact with id=${contactId} not found`);
  }
  res.status(200).json({
    message: "contact deleted",
  });
};

export default {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  updateById: ctrlWrapper(updateById),
  deleteById: ctrlWrapper(deleteById),
};
