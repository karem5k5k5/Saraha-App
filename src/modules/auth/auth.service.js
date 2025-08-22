import User from './../../DB/models/user.model.js';
import { OAuth2Client } from 'google-auth-library';
import { sendMail } from '../../utils/send-mail/sendMail.js';
import { geneateOTP } from '../../utils/otp/generateOTP.js';
import { Token } from '../../DB/models/token.model.js';
import { hashPassword, verifyPassword } from '../../utils/hash/hashPassword.js';
import { generateToken } from '../../utils/token/token.js';

// register new user
export const register = async (req, res) => {

    //get data from req body
    const { fullName, email, password, phoneNumber, dob } = req.body;

    //check if user already exists
    const user = await User.findOne({
        $or: [{
            $and: [
                { email: { $exists: true } }, //email exists
                { email: { $ne: null } }, //email is not null
                { email } //email === req.body.email
            ]
        }, {
            $and: [
                { phoneNumber: { $exists: true } }, //phone number exists
                { phoneNumber: { $ne: null } }, //phone number is not null
                { phoneNumber } //phone number === req.body.phoneNumber
            ]
        }]
    })
    if (user) {
        throw new Error("User already exists", { cause: 409 })
    }
    //hash password
    const hashedPassword = await hashPassword(password)
    // generate otp, otp expire date and save them to db
    const { otp, otpExpire } = geneateOTP()
    // send mail : verify account via OTP
    if (email) {
        await sendMail({
            to: email,
            subject: "Verify your account",
            html: `<p>your otp to verify your account is ${otp}</p>`
        })
    }
    //create user in db
    await User.create({
        fullName,
        email,
        password: hashedPassword,
        phoneNumber,
        dob,
        otp,
        otpExpire
    })
    //return response
    return res.status(201).json({ success: true, message: "User created successfully" });

}

// verify account
export const verifyAccount = async (req, res) => {

    // get data from req body (otp,email)
    const { otp, email } = req.body
    // check user otp & otpExpire
    const user = await User.findOne({
        email,
        otp,
        otpExpire: { $gt: Date.now() }
    })

    // fail case
    if (!user) {
        throw new Error("Invalid OTP", { cause: 401 })
    }

    //success case
    // update user : isVerfied, otp, otpExpire
    user.isVerified = true
    user.otp = undefined
    user.otpExpire = undefined

    // save user to db
    await user.save()
    // send response
    return res.status(201).json({ success: true, message: "Account verified successfully" })

}

// resend OTP
export const resendOTP = async (req, res) => {
    // get data from req body
    const { email } = req.body
    // generate new OTP 
    const { otp, otpExpire } = geneateOTP()
    // check existence and update user
    const user = await User.findOneAndUpdate({ email }, { otp, otpExpire })
    if (!user) {
        throw new Error("User not found", { cause: 404 })
    }
    // send email
    await sendMail({
        to: email,
        subject: "New OTP",
        html: `<p>your new otp to verify account is ${otp}</p>`
    })
    // send response
    return res.status(201).json({ success: true, message: "OTP sent successfully" })

}

// login with google
export const googleLogin = async (req, res) => {

    // get data from req body (idToken)
    const { idToken } = req.body
    // integrate client
    const client = new OAuth2Client("475515404720-pvf8s4blqbk037papo8mi19alsoa6dm6.apps.googleusercontent.com")
    // verify idToken
    const ticket = await client.verifyIdToken({ idToken })
    // get user data from payload
    const { name, email, phone, birthdate } = ticket.getPayload()
    // check user : login or create new user
    let user = await User.findOne({ email })

    if (!user) {
        // create new user
        user = await User.create({ fullName: name, email, phoneNumber: phone, dob: birthdate, isVerified: true, userAgent: "google" })
    }

    // generate token
    const token = generateToken(user._id)

    //send response
    return res.status(201).json({ success: true, message: "User logged in successfully", data: { user, token } })

}

// user login
export const login = async (req, res) => {

    // get data from req
    const { email, phoneNumber, password } = req.body
    // check email
    const user = await User.findOne({
        $or: [{
            $and: [
                { email: { $exists: true } },
                { email: { $ne: null } },
                { email }
            ]
        }, {
            $and: [
                { phoneNumber: { $exists: true } },
                { phoneNumber: { $ne: null } },
                { phoneNumber }
            ]
        }]
    })
    if (!user) {
        throw new Error("Invalid Credentials", { cause: 401 })
    }
    // check password
    const isMatch = verifyPassword(password, user.password)
    if (!isMatch) {
        throw new Error("Invalid Credentials", { cause: 401 })
    }
    // check user verification
    if (!user.isVerified) {
        throw new Error("PLease verify your account", { cause: 401 })
    }
    // generate token
    const accessToken = generateToken(user._id, { expiresIn: "1h" })
    const refreshToken = generateToken(user._id, { expiresIn: "7d" })
    // store refreshToken into DB
    await Token.create({ token: refreshToken, user: user._id, type: "refresh" })
    // send response
    return res.status(201).json({ success: true, message: "User logged in successfully", accessToken, refreshToken })

}

// reset password
export const resetPassword = async (req, res) => {
    // get data from req body
    const { email, otp, newPassword } = req.body
    // check user existence
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error("User not found", { cause: 404 })
    }
    // check otp 
    if (user.otp != otp) {
        throw new Error("Invalid OTP", { cause: 400 })
    }
    // check otp expiration
    if (user.otpExpire < Date.now()) {
        throw new Error("Expired OTP", { cause: 400 })
    }
    // update user 
    user.password = await hashPassword(newPassword)
    user.credentialsUpdatedAt = Date.now()
    // remove otp from DB
    user.otp = undefined
    user.otpExpire = undefined
    // save user to DB
    await user.save()
    // destroy all refresh tokens in DB
    await Token.deleteMany({ user: user._id, type: "refresh" })
    // send response
    return res.status(201).json({ success: true, message: "reset password successfully" })
}

// user logout
export const logout = async (req, res) => {
    // get user from req - auth middleware
    const user = req.user
    // get token from req headers
    const token = req.headers.authorization
    // store token into DB
    await Token.create({ token, user: user._id })
    // send response
    return res.status(201).json({ success: true, message: "User logged out successfully" })
}