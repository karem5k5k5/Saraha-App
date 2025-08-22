import { model, Schema } from "mongoose"



const schema = new Schema({
    receiver: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String,
        minlength: 3,
        maxlength: 1000,
        required: function () {
            if (this.attachments.length === 0) {
                return true
            }
            return false
        }
    },
    attachments: [
        { secure_url: String, public_id: String }
    ],
    sender: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true })

export const Message = model("Message", schema)