import fs from 'node:fs';
import jwt from 'jsonwebtoken';
import { Token } from '../../DB/models/token.model.js';

export const globalErrorHandler = async (err, req, res, next) => {
    try {
        // rollback image in fail case
        if (req.file) {
            fs.unlinkSync(req.file.path)
        }
        // check for jwt expiration and refresh token
        if (err.message == "jwt expired") {
            // get refresh token from req headers
            const refreshToken = req.headers.refreshtoken
            // verify refresh token
            const { id } = jwt.verify(refreshToken, process.env.JWT_SECRET)
            // check for refresh token into DB
            const tokenExist = await Token.findOneAndDelete({ token: refreshToken, user: id, type: "refresh" })
            if (!tokenExist) {
                throw new Error("Inavlid refresh token", { cause: 401 })
                // logout from all devices
            }
            // generate new access and refresh tokens
            const accessToken = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" })
            const newRefreshToken = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" })
            // store new refresh token into DB
            await Token.create({ token: newRefreshToken, user: id, type: "refresh" })
            // send response
            return res.status(201).json({ success: true, message: "refresh token successfully", accessToken, refreshToken: newRefreshToken })
        }
        // send response
        return res.status(err.cause || 500).json({ success: false, message: err.message, stack: err.stack })
    } catch (error) {
        return res.status(error.cause || 500).json({ success: false, message: error.message })
    }
}