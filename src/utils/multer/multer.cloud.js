import multer, { diskStorage } from "multer"

export const fileUploadCloud = () => {
    const storage = diskStorage({})
    return multer({ storage })
}