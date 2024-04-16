import User from "@/models/users.model";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import SMTPTransport from "nodemailer/lib/smtp-transport";

export const sendEmail = async ({ email, emailType, userId }: any) => {
    try {
        // * can also use uuid() to generate token
        const hashedToken = await bcrypt.hash(userId.toString(), 10);

        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId, {
                $set: {
                    verifyToken: hashedToken,
                    verifyTokenExpiry: Date.now() + 3600000,
                },
            });
        } else if (emailType === "RESET") {
            await User.findByIdAndUpdate(userId, {
                $set: {
                    forgotPasswordToken: hashedToken,
                    forgotPasswordTokenExpiry: Date.now() + 3600000,
                },
            });
        }

        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        } as SMTPTransport.Options);

        const mailOptions = {
            from: process.env.MAIL_FROM,
            to: email,
            subject:
                emailType === "VERIFY"
                    ? "Verify your Email"
                    : "Reset your password",
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyuser?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
            or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyuser?token=${hashedToken}
            </p>`,
        };

        const mailResponse = await transporter.sendMail(mailOptions);
        return mailResponse;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
