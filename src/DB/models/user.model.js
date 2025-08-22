import { model, Schema } from "mongoose";

const schema = new Schema({
    firstName: {
        type: String,
        required: function () {
            if (this.fullName) {
                return false
            }
            return true
        },
        trim: true,
        lowercase: true,
        minlength: 2,
        maxlength: 20
    },
    lastName: {
        type: String,
        required: function () {
            if (this.fullName) {
                return false
            }
            return true
        },
        trim: true,
        lowercase: true,
        minlength: 2,
        maxlength: 20
    },
    email: {
        type: String,
        required: function () { //dynamic validation
            if (this.phoneNumber) {
                return false
            }
            return true
        },
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: function () {
            if (this.userAgent === "google") {
                return false
            }
            return true
        },
        trim: true,
        minlength: 6,
    },
    phoneNumber: {
        type: String,
        required: function () { //dynamic validation
            if (this.email) {
                return false
            }
            return true
        },
        trim: true,
    },
    dob: {
        type: Date,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    userAgent: {
        type: String,
        enum: ["local", "google"],
        default: "local"
    },
    profilePicture: {
        type: String
    },
    cloudProfilePicture: {
        secure_url: {
            type: String
        },
        public_id: {
            type: String
        }
    },
    credentialsUpdatedAt: {
        type: Date,
        default: Date.now()
    },
    otp: {
        type: String
    },
    otpExpire: {
        type: Date
    },
    deletedAt: {
        type: Date
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
})

schema.virtual("fullName").get(function () {
    return `${this.firstName} ${this.lastName}`
})

schema.virtual("fullName").set(function (v) {
    const [firstName, lastName] = v.split(" ")
    this.firstName = firstName
    this.lastName = lastName
})

schema.virtual("age").get(function () {
    return new Date().getFullYear() - new Date(this.dob).getFullYear()
})

const User = model("User", schema)

export default User