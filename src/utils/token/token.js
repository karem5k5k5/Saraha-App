import jwt from "jsonwebtoken"

export const generateToken = (id, options) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, options)
}

export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET)
}