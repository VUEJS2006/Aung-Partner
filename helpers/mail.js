import nodemailer from "nodemailer"

export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS
    }
});

export const sendOTP = async (email, otp) => {
    await transporter.sendMail({
        from: `"Bagan 360" <${process.env.EMAIL}>`,
        to: email,
        subject: "Your OTP Code",
        html: `
        <div style="font-family: Arial, sans-serif; background:#f5f1eb; padding:20px;">
            <div style="max-width:420px; margin:auto; background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <div style="background:#5a3825; color:white; padding:20px; text-align:center;">
                    <h2 style="margin:0;">Bagan 360</h2>
                </div>

                <!-- Body -->
                <div style="padding:30px; text-align:center;">
                    <h3 style="color:#5a3825;">Verify Your Account</h3>
                    <p style="color:#555;">Use this OTP to continue</p>

                    <div style="
                        margin:20px auto;
                        padding:15px;
                        font-size:28px;
                        letter-spacing:6px;
                        font-weight:bold;
                        background:#f3e8dc;
                        color:#5a3825;
                        border-radius:8px;
                        display:inline-block;
                    ">
                        ${otp}
                    </div>

                    <p style="color:#888; font-size:12px;">
                        Expires in 5 minutes
                    </p>
                </div>

                <!-- Footer -->
                <div style="background:#f5f1eb; padding:10px; text-align:center; font-size:12px; color:#777;">
                    © ${new Date().getFullYear()} Bagan 360
                </div>

            </div>
        </div>
        `
    });
};

export const sendMail = async (email, subject, message) => {
    await transporter.sendMail({
        from: `"Bagan 360" <${process.env.EMAIL}>`,
        to: email,
        subject,
        html: `
        <div style="font-family: Arial, sans-serif; background:#f5f1eb; padding:20px;">
            <div style="max-width:420px; margin:auto; background:#ffffff; border-radius:10px; text-align:center; box-shadow:0 4px 10px rgba(0,0,0,0.1); overflow:hidden;">
                
                <div style="background:#5a3825; color:white; padding:15px;">
                    <h3 style="margin:0;">Bagan 360</h3>
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

