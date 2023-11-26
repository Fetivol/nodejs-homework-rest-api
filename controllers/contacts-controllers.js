import Contact from "../models/Contact.js";

import { ctrlWrapper } from "../decorators/index.js";

import { HttpError } from "../helpers/index.js";

import { contactAddSchema, contactUpdateSchema } from "../models/Contact.js";

const getAll = async (req, res) => {
  const result = await Contact.find({}, "-createdAt -updatedAt");
  res.status(200).json(result);
};
// const getById = async (req, res) => {
//   const { contactId } = req.params;
//   const result = await contactsService.getContactById(contactId);
//   if (!result) {
//     throw HttpError(404, `Contact with id=${contactId} not found`);
//   }
//   res.status(200).json(result);
// };

const add = async (req, res) => {
  const result = await Contact.create(req.body);
  res.status(201).json(result);
};

// const updateById = async (req, res) => {
//   const { contactId } = req.params;
//   const result = await contactsService.updateContactById(contactId, req.body);
//   if (!result) {
//     throw HttpError(404, `Contact with id=${contactId} not found`);
//   }
//   res.status(200).json(result);
// };

// const deleteById = async (req, res) => {
//   const { contactId } = req.params;
//   const result = await contactsService.removeContact(contactId);
//   if (!result) {
//     throw HttpError(404, `Contact with id=${contactId} not found`);
//   }
//   res.status(200).json({
//     message: "contact deleted",
//   });
// };

export default {
  getAll: ctrlWrapper(getAll),
  // getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  // updateById: ctrlWrapper(updateById),
  // deleteById: ctrlWrapper(deleteById),
};
