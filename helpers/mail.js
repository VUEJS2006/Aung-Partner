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
        from: `"Aung Partner" <${process.env.EMAIL}>`,
        to: email,
        subject,
        html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; background:#f9f6f0; padding:30px 15px;">
            <div style="max-width:460px; margin:auto; background:#ffffff; border-radius:12px; text-align:center; box-shadow:0 6px 15px rgba(62,14,0,0.08); overflow:hidden; border: 1px solid #f0e6de;">
                
                <!-- Header with Gradient using your theme colors -->
                <div style="background: linear-gradient(135deg, #3E0E00 0%, #7C310B 100%); color:white; padding:25px 20px;">
                    <h2 style="margin:0; font-size:22px; font-weight:600; letter-spacing:0.5px;">Aung Partner</h2>
                </div>

                <!-- Body Content -->
                <div style="padding:35px 30px; text-align:left;">
                    <h4 style="color:#3E0E00; margin-top:0; font-size:18px; font-weight:600;">${subject}</h4>
                    <div style="color:#555555; font-size:14px; line-height:1.6;">
                        ${message}
                    </div>
                </div>

                <!-- Footer -->
                <div style="background:#fcf9f5; padding:15px; font-size:12px; color:#8c7a70; border-top:1px solid #f0e6de;">
                    &copy; ${new Date().getFullYear()} Aung Partner. All rights reserved.
                </div>

            </div>
        </div>
        `
    });
};
