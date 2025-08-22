import joi from "joi"
import { generalFields } from './../../utils/validation/genrealFieldsValidation.js';

export const sendMessageSchema = joi.object({
    receiver: generalFields.objectId.required(),
    sender: generalFields.objectId,
    content: joi.string().min(3).max(1000)
}).required()