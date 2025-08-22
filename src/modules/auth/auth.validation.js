import joi from 'joi';
import { generalFields } from '../../utils/validation/genrealFieldsValidation.js';

// register schema
export const registerSchema = joi.object({
    fullName: generalFields.fullName,
    email: generalFields.email,
    password: generalFields.password,
    phoneNumber: generalFields.phoneNumber,
    dob: generalFields.dob
}).or("email", "phoneNumber").required()

//login schema
export const loginSchema = joi.object({
    email: generalFields.email,
    password: generalFields.password,
    phoneNumber: generalFields.phoneNumber,
}).or("email", "phoneNumber").required()

// resetPassrod schema
export const resetPasswordSchema = joi.object({
    email: generalFields.email,
    otp: generalFields.otp,
    newPassword: generalFields.password
}).required()