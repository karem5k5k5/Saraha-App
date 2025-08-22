import User from '../DB/models/user.model.js';
import { Token } from '../DB/models/token.model.js';
import { verifyToken } from '../utils/token/token.js';

export const authUser = async (req, res, next) => {
    // get token from req headers
    const token = req.headers.authorization
    if (!token) {
        throw new Error("jwt is required", { cause: 401 })
    }
    // verify token and get id
    const { id, iat } = verifyToken(token)
    // check token into DB
    const blockedToken = await Token.findOne({ token, type: "access" })
    if (blockedToken) {
        throw new Error("Invalid Token", { cause: 401 })
    }
    // check user existence
    const user = await User.findById(id)
    if (!user) {
        throw new Error("User not found", { cause: 404 })
    }
    // check token expiration
    if (new Date(iat * 1000) < user.credentialsUpdatedAt) {
        throw new Error("Expired Token", { cause: 401 })
    }
    // add user to req body
    req.user = user
    // call next
    return next()
}