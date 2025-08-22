import joi from "joi"

export const generalFields = {
    fullName: joi.string().trim().required().lowercase().min(5).max(41),
    email: joi.string().email().trim().lowercase(),
    password: joi.string().min(6).trim().required(),
    phoneNumber: joi.string().trim().length(11),
    dob: joi.date(),
    otp : joi.string().length(5),
    objectId:joi.string().hex().length(24)
}