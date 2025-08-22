import schedule from "node-schedule"
import User from "../../DB/models/user.model.js"
import { Token } from "../../DB/models/token.model.js"

export const scheduler = () => {
    schedule.scheduleJob("1 1 8 * * *", async () => {
        // specify 3 months long date
        const threeMonthsAgo = new Date(Date.now() - 3 * 30 * 24 * 60 * 60 * 1000)
        // find users to delete
        const users = await User.find({ deletedAt: { $gte: threeMonthsAgo } })
        for (const user of users) {
            // delete user folder from server [local | cloud]
            if (user.cloudProfilePicture.public_id) {
                await deleteUserFolder(`saraha-app/users/${user._id}`)
            }
            if (user.profilePicture) {
                fs.rmSync(`uploads/${user._id}`, { recursive: true, force: true })
            }
            // delete user refresh tokens
            await Token.deleteMany({ user: user._id, type: "refresh" })
        }
        // delete users
        await User.deleteMany({ deletedAt: { $gte: threeMonthsAgo } })
    })
}