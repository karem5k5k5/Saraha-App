import { Router } from "express";
import { googleLogin, login, logout, register, resendOTP, resetPassword, verifyAccount } from "./auth.service.js";
import { isValid } from './../../middlewares/validation.middleware.js';
import { loginSchema, registerSchema, resetPasswordSchema } from './auth.validation.js';
import { authUser } from './../../middlewares/auth.middleware.js';

const router = Router();

router.post("/register", isValid(registerSchema), register);
router.post("/verify-account", verifyAccount)
router.post("/resend-otp", resendOTP)
router.post("/google-login", googleLogin)
router.post("/login", isValid(loginSchema), login)
router.patch("/reset-password", isValid(resetPasswordSchema), resetPassword)
router.post("/logout", authUser, logout)

export default router;
