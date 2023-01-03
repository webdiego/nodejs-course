var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import nodeMailer from 'nodemailer';
export const sendEmail = (options) => __awaiter(void 0, void 0, void 0, function* () {
    // 1) Create a transporter
    const transporter = nodeMailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
    // 2) Define the email options
    const mailOptions = {
        from: 'Diego Massarini',
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html: '',
    };
    // 3) Actually send the email
    yield transporter.sendMail(mailOptions);
});
//# sourceMappingURL=email.js.map