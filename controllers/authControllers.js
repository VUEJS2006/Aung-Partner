import db from "../config/db.js";
import bcrypt from "bcryptjs";
import { json } from "express";
import jwt from "jsonwebtoken";
import { generateOTP, sendOTP, sendMail } from "../helpers/mail.js"
import { asyncHandel } from "../middleware/asyncMiddleware.js";
import fs from "fs"
import path from "path"
import sharp from "sharp";


export const register = asyncHandel(async (req, res) => {
    try {

        const { username, email, password, nrc, township, region, phone, address, birthday, role, status } = req.body;
        // const image = req.file ? req.file.filename : null

        if (!username || !email || !password) {
            return res.status(401).json({
                message: 'All field are required!',
                success: false
            })
        }

        const [checkUser] = await db.query("SELECT * FROM shareholders WHERE email = ? ", [email]);

        if (checkUser.length > 0) {
            return res.status(401).json({
                message: 'Email Already Exists!',
                success: false
            })
        }

        const otp = generateOTP()


        await db.query("DELETE FROM otp_codes WHERE email=?", [email]);
        await db.query("INSERT INTO otp_codes (email,otp,expires_at) VALUES  (?, ?, DATE_ADD(NOW(), INTERVAL 5 MINUTE))", [email, otp]);
        await sendOTP(email, otp);

        const tempToken = jwt.sign(
            {
                username,
                email,
                password,
                nrc,
                phone,
                address,
                region,
                township,
                birthday
            },
            process.env.JWT_SECRET,
            { expiresIn: "10m" }
        );



        res.status(200).json({
            message: "OTP sent successfully",
            success: true,
            token: tempToken,
        });


    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: err.message,
            success: false
        })
    }
})

export const verifyOTP = asyncHandel(async (req, res) => {
    const { email, otp, token } = req.body;


    const [check] = await db.query("SELECT * FROM otp_codes WHERE email = ? AND otp = ? AND expires_at > NOW()", [email, otp]);

    if (check.length === 0) {
        return res.status(400).json({
            message: "Invalid or expired OTP",
            success: false
        });
    }

    let user;
    try {
        user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        return res.status(400).json({
            message: "Token expired"
        });
    }

    const hashedPassword = await bcrypt.hash(user.password, 12);


    const [data] = await db.query("INSERT INTO shareholders (username,email,password,nrc,phone,address,region,township,birthday,role,status) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
        [
            user.username,
            user.email,
            hashedPassword,
            user.nrc,
            user.phone,
            user.address,
            user.region,
            user.township,
            user.birthday,
            "user",
            "pending"
        ]
    );

    await db.query("DELETE FROM otp_codes WHERE email=?", [email]);

    await sendMail(
        email,
        "Account Pending",
        `<h3>Hello your account is pending!!</h3>`

    );
    res.status(201).json({
        message: "Register success, waiting admin approval",
        success: true,

    });

})

export const login = asyncHandel(async (req, res) => {
    try {

        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                message: 'All filed are required!',
                success: false
            })
        }

        const [userdata] = await db.query("SELECT * FROM shareholders WHERE email = ?", [email])
        const user = userdata[0]
        if (!user) {
            return res.status(401).json({
                message: 'fail',
                success: false
            })
        }
        if (!user.password) {
            return res.status(500).json({
                message: "invalid",
                success: false
            });
        }
        if (!user.email) {
            return res.status(500).json({
                message: "invalid",
                success: false
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Password does not match" });
        }
        if (user.status === 'pending') {
            return res.status(403).json({ message: 'pending', success: false });
        } else if (user.status === 'cancel') {
            return res.status(403).json({ message: 'cancel', success: false });
        }

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        })
        res.cookie("access_token", token, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.status(200).json({
            message: 'success',
            success: true,
            token,
            user: {
                id: user.id,
                name: user.username,
                email: user.email,
                nrc: user.nrc,
                birthday: user.birthday,
                phone: user.phone,
                role: user.role,
                region: user.region,
                township: user.township,
                address: user.address,
                status: user.status,
                image: user.image
            }
        })


    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: err.message,
            success: false
        })
    }
})

export const logout = asyncHandel(async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })
        return res.status(200).json({
            message: "Logout successful",
            success: true
        });
    } catch (err) {
        res.status(500).json({
            message: err.message,
            success: false
        });
    }
})

export const pendingCheckUser = asyncHandel(async (req, res) => {
    try {
        const [users] = await db.query("SELECT * FROM shareholders WHERE status = 'pending'")
        res.status(200).json({
            success: true,
            message: 'pendingUser',
            data: users
        });

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: err.message,
            success: false
        });
    }
})

export const approvedUser = asyncHandel(async (req, res) => {
    try {
        const userId = req.params.id;

        const [checkUser] = await db.query(
            "SELECT * FROM shareholders WHERE id = ?",
            [userId]
        );

        if (checkUser.length === 0) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        const user = checkUser[0];

        await db.query(
            "UPDATE shareholders SET status = 'approved' WHERE id = ?",
            [userId]
        );


        await sendMail(
            user.email,
            "Account Approved",
            `<h3>Hello ${user.username}, your account is approved!</h3>`
        );

        res.status(200).json({
            success: true,
            message: "User approved successfully",
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err.message,
            success: false
        });
    }
});

export const cancelledUser = asyncHandel(async (req, res) => {
    try {

        const userId = req.params.id;
        const [checkUser] = await db.query(
            "SELECT * FROM shareholders WHERE id = ?",
            [userId]
        );

        if (checkUser.length === 0) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        const user = checkUser[0];
        await db.query("UPDATE shareholders SET status = 'cancel' WHERE id = ?",
            [userId]);
        await sendMail(
            user.email,
            "Account Cancelled",
            `<h3>Hello ${user.username}, your account is cancelled!</h3>`
        );
        res.status(200).json({
            message: "User cancelled successfully",
            success: true,

        })


    }
    catch (err) {
        res.status(500).json({
            message: err.message,
            success: false
        });
    }
})

export const pendingUser = asyncHandel(async (req, res) => {
    try {

        const userId = req.params.id;
        const [data] = await db.query("UPDATE shareholders SET status = 'pending' WHERE id = ?",
            [userId]);
        res.status(200).json({
            message: "User Pending successfully",
            success: true,

        })


    }
    catch (err) {
        res.status(500).json({
            message: err.message,
            success: false
        });
    }
})

export const getProfile = asyncHandel(async (req, res) => {
    try {

        const userID = req.params.id;

        const [checkUser] = await db.query("SELECT  id, username, email, phone, address, township, region,nrc FROM shareholders WHERE id = ?", [userID]);
        res.status(200).json({
            success: true,
            data: checkUser[0]
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: err.message,
            success: false
        })
    }
})

export const updateProfile = asyncHandel(async (req, res) => {
    try {

        const userID = req.user.id;
        const { username, phone, address, nrc, region, township, birthday } = req.body;

        const [user] = await db.query("SELECT * FROM shareholders WHERE id = ? ", [userID])

        if (user.length === 0) {
            return res.status(404).json({
                message: "User not found!",
                success: false
            })
        }

        let image = user[0].image;
        if (req.file) {
            if (user[0].image) {

                const oldPath = path.join("image/uploads", user[0].image);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }

            }
            const fileName = Date.now() + ".webp"
            await sharp(req.file.buffer)
                .resize(800)
                .webp({ quality: 70 })
                .toFile(`image/uploads/${fileName}`)

            image = fileName

        }

        const [data] = await db.query("UPDATE shareholders SET username = ?,phone = ? ,address = ?,nrc = ?,region = ?,township = ?,birthday = ?,image = ? WHERE id = ?",
            [username || user[0].username,
            phone || user[0].phone,
            address || user[0].address,
            nrc || user[0].nrc,
            region || user[0].region,
            township || user[0].township,
            birthday || user[0].birthday,
                image,
                userID
            ]
        );
        return res.status(200).json({
            message: "Profile updated successfully",
            success: true,
        });

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: err.message,
            success: false
        })
    }
})


export const registerList = asyncHandel(async (req, res) => {
    try {
        const [data] = await db.query("SELECT * FROM shareholders");
        res.status(200).json({
            message: "User List successfully",
            success: true,
            count: data.length,
            data: {
                data
            }
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: err.message,
            success: false
        })
    }
});


export const ChangePassword = asyncHandel(async (req, res) => {
    try {
        const userID = req.params.id
        const { currentPassword, newPassword, confirmPassword } = req.body;
        const [checkUser] = await db.query("SELECT * FROM shareholders WHERE id = ?", [userID]);
        if (checkUser.length === 0) {
            return res.status(404).json({
                message: "User not Found!",
                success: false
            })
        }
        const isMatch = await bcrypt.compare(currentPassword, checkUser[0].password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Current password is incorrect!",
                success: false
            })
        }


        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                message: "Password Can't same!",
                success: false
            })
        }
        if (currentPassword === newPassword) {
            return res.status(400).json({
                message: "New password cannot be same as old password!",
                success: false
            });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        const [data] = await db.query("UPDATE shareholders SET password = ? WHERE id = ?", [hashedPassword, userID]);
        return res.status(200).json({
            message: "Change Password successfully",
            success: true,
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: err.message,
            success: false
        })
    }
})

export const AccountDelete = asyncHandel(async (req, res) => {
    try {

        const userID = req.params.id;

        const { email, password, text } = req.body;
        const [checkUser] = await db.query("SELECT * FROM shareholders WHERE id = ?", [userID])
        if (checkUser === 0) {
            return res.status(404).json({
                message: "User not Found!",
                success: false
            })
        }
        if (email !== checkUser[0].email) {
            return res.status(401).json({
                message: "Email Invalid!",
                success: false
            })
        }
        const isMatch = await bcrypt.compare(password, checkUser[0].password)
        if (!isMatch) {
            return res.status(401).json({
                message: "Password Does not match!",
                success: false
            })
        }
        if (text !== 'DELETE') {
            return res.status(401).json({
                message: "Please Write DELETE!",
                success: false
            })
        }

        const [data] = await db.query("DELETE  FROM shareholders WHERE id = ?", [userID])
        res.status(200).json({
            success: true,
            message: "User Account Deleted Successfully!",
            data: { data }
        });

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: err.message,
            success: false
        })
    }
})

export const AdminProfileUpdate = asyncHandel(async (req, res) => {
    try {

        const userID = req.user.id;
        const { username, email, phone, address, birthday } = req.body;

        const [user] = await db.query("SELECT * FROM shareholders WHERE id = ?", [userID]);

        if (user.length === 0) {
            return res.status(404), json({
                message: "User Not Found!",
                success: false
            })
        }
        let image = user[0].image;

        if (req.file) {
            if (user[0].image) {

                const oldPath = path.join(
                    "image/uploads",
                    user[0].image
                );

                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
            const fileName = Date.now() + ".webp";

            await sharp(req.file.buffer)
                .resize(800)
                .webp({ quality: 80 })
                .toFile(`image/uploads/${fileName}`);

            image = fileName;
        }
        const [data] = await db.query("UPDATE shareholders SET username = ?,email = ?,phone = ?,address = ?,birthday = ?,image = ? WHERE id = ?", [username || user[0].username, email || user[0].email, address || user[0].address, phone || user[0].phone, birthday || user[0].birthday, image, userID])
        return res.status(200).json({
            message: "Profile updated successfully",
            success: true,
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: err.message,
            success: false
        })
    }
})

export const AdminChangePassword = asyncHandel(async (req, res) => {
    try {
        const { id } = req.params;
        const { password, confirmPassword } = req.body;
        if (password !== confirmPassword) {
            return res.status(401).json({
                message: "Password is Not Same!",
                success: false
            })
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const [data] = await db.query("UPDATE shareholders SET password = ? , WHERE id = ?", [hashedPassword, id]);
        return res.status(401).json({
            message: "Password Change Success!",
            success: true
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: err.message,
            success: false
        })
    }
})