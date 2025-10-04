import bcrypt from 'bcrypt';

export const hashPassword = async (password) => {
    return await bcrypt.hash(password, 10)
}

export const verifyPassword = async (password1, password2) => {
    return await bcrypt.compare(password1, password2)
}