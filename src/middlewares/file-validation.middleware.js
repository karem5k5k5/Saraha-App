import fs from "node:fs"
import { fileTypeFromBuffer } from "file-type"


export const fileValidation = (allowedType = ["image/png", "image/jpeg", "image/jpg"]) => {
    return async (req, res, next) => {
        // get file path
        const filePath = req.file.path
        // read the file and return buffer
        const buffer = fs.readFileSync(filePath)
        // get the file type
        const type = await fileTypeFromBuffer(buffer)
        // validate
        if (!type || !allowedType.includes(type.mime)) {
            throw new Error("Invalid file format", { cause: 400 })
        }
        return next()
    }
}