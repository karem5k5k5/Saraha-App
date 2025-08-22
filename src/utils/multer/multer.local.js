import multer, { diskStorage } from "multer"
import { nanoid } from "nanoid"
import fs from 'node:fs';


export const fileUpload = (folder) => {
    const storage = diskStorage({
        destination: (req, res, cb) => {
            const dest = `uploads/${req.user._id}/${folder}`
            if (!fs.existsSync(dest)) {
                fs.mkdirSync(dest, { recursive: true })
            }
            cb(null, dest)
        },
        filename: (req, file, cb) => {
            cb(null, nanoid(8) + "_" + file.originalname)
        }
    })
    return multer({ storage })
}