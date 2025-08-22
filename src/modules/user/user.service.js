import User from './../../DB/models/user.model.js';
import fs from 'node:fs';
import { deleteImage, deleteUserFolder, uploadFile } from '../../utils/cloud/cloudinary.js';

// get user by id
export const getUserById = async (req, res) => {
    // get user from req body - auth middleware
    const user = req.user
    // hide password
    user.password = undefined
    //send response 
    return res.status(201).json({ success: true, user })

}

//update user
export const updateUser = async (req, res) => {
    // get data from req body
    const { fullName, email, dob, phoneNumber } = req.body
    // get user from req body - auth middleware
    const user = req.user
    // check email & phone uniqueness
    if (email || phoneNumber) {
        const exist = await User.findOne({
            $or: [
                {
                    $and: [
                        { email: { $exists: true } },
                        { email: { $ne: null } },
                        { _id: { $ne: id } },
                        { email }
                    ]
                }, {
                    $and: [
                        { phoneNumber: { $exists: true } },
                        { phoneNumber: { $ne: null } },
                        { _id: { $ne: user._id } },
                        { phoneNumber }
                    ]
                }
            ]
        })

        if (exist) {
            throw new Error("User already exists", { cause: 409 })
        }
    }

    // update user
    user.fullName = fullName || user.fullName
    user.dob = dob || user.dob
    user.email = email || user.email
    user.phoneNumber = phoneNumber || user.phoneNumber
    // save user to db
    await user.save()
    // send response
    user.password = undefined
    return res.status(201).json({ success: true, message: "User updated Successfully", user })

}

// delete user
export const deleteUser = async (req, res) => {
    // get user from req body - auth middleware
    const user = req.user
    // update user deletedAt
    user.deletedAt = Date.now()
    await user.save()
    // send response
    return res.status(201).json({ success: true, message: "User deleted Successfully" })

}

//upload profile picture
export const uploadProfilePicture = async (req, res) => {
    // get user from req body - auth middleware
    const user = req.user
    // delete old image
    if (user.profilePicture) {
        fs.unlinkSync(user.profilePicture)
    }
    // update user
    await User.findByIdAndUpdate({ _id: user._id }, { profilePicture: req.file.path })
    // send response
    return res.status(201).json({ success: true, message: "User's profile picture uploaded Successfully" })
}

//upload profile picture - cloud
export const uploadProfilePictureCloud = async (req, res) => {
    // get user from req body - auth middleware
    const user = req.user
    // delete old image
    if (user.cloudProfilePicture.public_id) {
        await deleteImage(user.cloudProfilePicture.public_id)
    }
    // upload file to cloud
    const { secure_url, public_id } = await uploadFile(req.file.path, `saraha-app/users/${user._id}/profile-picture`)
    // update user
    await User.updateOne({ _id: user._id }, { cloudProfilePicture: { secure_url, public_id } })
    // send response
    return res.status(201).json({ success: true, message: "User's profile picture uploaded Successfully", data: { secure_url, public_id } })
}