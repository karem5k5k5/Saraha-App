import { Router } from "express";
import { deleteUser, getUserById, updateUser, uploadProfilePicture, uploadProfilePictureCloud } from "./user.service.js";
import { fileUpload } from "../../utils/multer/multer.local.js";
import { fileValidation } from "../../middlewares/file-validation.middleware.js";
import { authUser } from './../../middlewares/auth.middleware.js';
import { fileUploadCloud } from './../../utils/multer/multer.cloud.js';

const router = Router();
router.get("/", authUser, getUserById)
router.put("/", authUser, updateUser)
router.delete("/", authUser, deleteUser)
router.post("/upload-profile-picture", authUser, fileUpload("profile-picture").single("profilePic"), fileValidation(), uploadProfilePicture)
router.post("/upload-profile-picture-cloud", authUser, fileUploadCloud().single("profilePic"), fileValidation(), uploadProfilePictureCloud)

export default router;
