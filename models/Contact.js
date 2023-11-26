import Joi from "joi";
import { Schema, model } from "mongoose";

import { handleSaveError } from "./hooks.js";

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);

contactSchema.post("save", handleSaveError);

export const contactAddSchema = Joi.object({
  name: Joi.string()
    .required()
    .messages({ "any.required": "Missing required name field" }),
  email: Joi.string().messages({
    "any.required": "Missing required email field",
  }),
  phone: Joi.string().messages({
    "any.required": "Missing required phone field",
  }),
  favorite: Joi.boolean(),
});

export const contactUpdateSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
  favorite: Joi.boolean(),
});

const Contact = model("contact", contactSchema);

export default Contact;
