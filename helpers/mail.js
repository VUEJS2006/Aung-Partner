import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    }
});

export const sendMail = async (email, subject, message) => {
    await transporter.sendMail({
        from: `"Aung partner" <${process.env.EMAIL}>`,
        to: email,
        subject,
        html: `
        <div style="font-family: Arial, sans-serif; background:#f5f1eb; padding:20px;">
            <div style="max-width:420px; margin:auto; background:#ffffff; border-radius:10px; text-align:center; box-shadow:0 4px 10px rgba(0,0,0,0.1); overflow:hidden;">
                
                <div style="background:#5a3825; color:white; padding:15px;">
                    <h3 style="margin:0;">Aung partner</h3>
                </div>

                <div style="padding:30px;">
                    <h4 style="color:#5a3825;">${subject}</h4>
                    <p style="color:#555; font-size:14px;">
                        ${message}
                    </p>
                </div>

            </div>
        </div>
        `
    });
};
