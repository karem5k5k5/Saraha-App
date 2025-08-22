import rateLimit from "express-rate-limit";


export const otpLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    limit: 5,
    handler: (req, res, next, options) => {
        throw new Error(options.message, { cause: options.statusCode })
    }
})

export const globalLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    limit: 5,
    handler: (req, res, next, options) => {
        throw new Error(options.message, { cause: options.statusCode })
    },
    skipSuccessfulRequests: true
})