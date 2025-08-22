import { v2 as cloudinary } from "cloudinary"

export const uploadFile = async (path, folder) => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    })
    return await cloudinary.uploader.upload(path, {
        folder
    })
}

export const uploadFiles = async (files,folder) => {
    const attachments = []
    for (const file of files) {
        const { secure_url, public_id } = await uploadFile(file.path, folder)
        attachments.push({ secure_url, public_id })
    }
    return attachments
}

export const deleteUserFolder = async (folder) => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    })
    await cloudinary.api.delete_resources_by_prefix(folder)
    await cloudinary.api.delete_folder(folder)
}

export const deleteImage = async (id) => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    })
    await cloudinary.uploader.destroy(id)
}