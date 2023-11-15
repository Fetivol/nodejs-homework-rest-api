import * as contactsService from "../models/contacts/index.js";

const getAll = async (req, res, next) => {
  try {
    const result = await contactsService.listContacts();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contactsService.getContactById(contactId);
    if (!result) {
      return res.status(404).json({
        message: `Contact with this id:${contactId} not found!`,
      });
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export default {
  getAll,
  getById,
};
