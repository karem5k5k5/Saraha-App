
import { uploadFiles } from './../../utils/cloud/cloudinary.js';
import User from './../../DB/models/user.model.js';
import { Message } from './../../DB/models/message.model.js';

export const sendMessage = async (req, res) => {
    // get data from req
    const { receiver } = req.params
    const { content } = req.body
    const files = req.files
    const sender = req.user?._id
    // check user existence
    const user = await User.findById(receiver)
    if (!user) {
        throw new Error("User not found", { cause: 404 })
    }
    // upload attachments to cloudinary
    const attachments = await uploadFiles(files, `saraha-app/${receiver}/messages`)
    // save message into DB
    await Message.create({ receiver, sender, content, attachments })
    // send response
    return res.status(201).json({ success: true, message: "Message sent Successfully" })
}

export const getMessage = async (req, res) => {
    // get id from req params
    const { id } = req.params
    // get user from auth middleware
    const user = req.user
    // get message from DB
    const message = await Message.findOne({ _id: id, receiver: user._id }, {}, { populate: { path: "sender", select: "fullName email age" } })
    // check message existence and user authorization
    if (!message) {
        throw new Error("Message not found", { cause: 404 })
    }
    // send reponse
    return res.status(200).json({ success: true, message })
}

export const deleteMessage = async (req, res) => {
    // get id from req params
    const { id } = req.params
    // get user from auth middleware
    const user = req.user
    // check message existence and delete
    const message = await Message.findOneAndDelete({ _id: id, receiver: user._id })
    if (!message) {
        throw new Error("Message not found", { cause: 404 })
    }
    // send reponse
    return res.status(200).json({ success: true, message: "Message deleted successfully" })
}