/**
 * generate new OTP code and expiration date
 * @param {*} expireTime (in milliseconds)
 * @returns object {otp,otpExpire}
 */
export const geneateOTP = (expireTime = 2 * 60 * 1000) => {
    const otp = Math.floor(Math.random() * 90000 + 10000)
    const otpExpire = Date.now() + expireTime

    return { otp, otpExpire }
}