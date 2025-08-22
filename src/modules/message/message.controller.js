import { Router } from "express";
import { fileUploadCloud } from './../../utils/multer/multer.cloud.js';
import { isValid } from "../../middlewares/validation.middleware.js";
import { sendMessageSchema } from "./message.validation.js";
import { deleteMessage, getMessage, sendMessage } from "./message.service.js";
import { authUser } from './../../middlewares/auth.middleware.js';

const router = Router();

router.post("/:receiver", fileUploadCloud().array("attachments", 5), isValid(sendMessageSchema), sendMessage)
router.post("/:receiver/sender", authUser, fileUploadCloud().array("attachments", 5), isValid(sendMessageSchema), sendMessage)
router.get("/:id", authUser, getMessage)
router.delete("/:id", authUser, deleteMessage)

export default router;
