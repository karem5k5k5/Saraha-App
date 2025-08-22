import { model, Schema } from "mongoose";


const schema = new Schema({
    token: {
        type: String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    type: {
        type: String,
        enum: ["access", "refresh"],
        default: "access"
    }
}, { timestamps: true })

export const Token = model("Token", schema)