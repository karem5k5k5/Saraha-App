import nodemailer from "nodemailer"
export const sendMail = async ({ to, subject, html }) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        auth: {
            user: process.env.NODEMAILER_EMAIL,
            pass: process.env.NODEMAILER_PASS
        }
    })

    await transporter.sendMail({
        from: `'Saraha App' <${process.env.NODEMAILER_EMAIL}>`,
        to,
        subject,
        html
    })
}