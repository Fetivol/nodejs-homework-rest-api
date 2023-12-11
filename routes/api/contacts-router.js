import express from "express";

import contactsControllers from "../../controllers/contacts-controllers.js";

import {
  authenticate,
  isEmptyBody,
  isValidId,
  upload,
} from "../../middlewares/index.js";

import { validateBody } from "../../decorators/index.js";

import {
  contactAddSchema,
  contactUpdateSchema,
  contactFavoriteSchema,
} from "../../models/Contact.js";

const contactsRouter = express.Router();

contactsRouter.use(authenticate);
contactsRouter.get("/", contactsControllers.getAll);

contactsRouter.get("/:contactId", isValidId, contactsControllers.getById);

contactsRouter.post(
  "/",
  upload.single("poster"),
  isEmptyBody,
  validateBody(contactAddSchema),
  contactsControllers.add
);

contactsRouter.put(
  "/:contactId",
  isValidId,
  isEmptyBody,
  validateBody(contactUpdateSchema),
  contactsControllers.updateById
);

contactsRouter.patch(
  "/:contactId/favorite",
  isValidId,
  isEmptyBody,
  validateBody(contactFavoriteSchema),
  contactsControllers.updateById
);
contactsRouter.delete("/:contactId", isValidId, contactsControllers.deleteById);

export default contactsRouter;
