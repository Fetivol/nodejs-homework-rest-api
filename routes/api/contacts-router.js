import express from "express";

import contactsControllers from "../../controllers/contacts-controllers.js";

import { isEmptyBody } from "../../middlewares/index.js";

import { validateBody } from "../../decorators/index.js";

import {
  contactAddSchema,
  contactUpdateSchema,
} from "../../schemas/contacts-schemas.js";

const contactsRouter = express.Router();

contactsRouter.get("/", contactsControllers.getAll);

contactsRouter.get("/:contactId", contactsControllers.getById);

contactsRouter.post(
  "/",
  isEmptyBody,
  validateBody(contactAddSchema),
  contactsControllers.add
);

contactsRouter.delete("/:contactId", contactsControllers.deleteById);

contactsRouter.put(
  "/:contactId",
  isEmptyBody,
  validateBody(contactUpdateSchema),
  contactsControllers.updateById
);

export default contactsRouter;
