import "dotenv/config"
export const adminPasscode = (req, res, next) => {
    try {

        const { passcode } = req.body;
        if (passcode === undefined) {
            return res.status(400).json({
                message: "Passcode Required!",
                success: false
            })
        }
        if (typeof passcode !== "number") {
            return res.status(400).json({
                success: false,
                message: "Passcode must be number!"
            });
        }
        if (passcode !== Number(process.env.PASS_CODE)) {
            return res.status(401).json({
                success: false,
                message: "Invalid Passcode!"
            });
        }

        next()


    } catch (err) {
        res.status(500).json({
            message: err.message,
            success: false
        });
    }
}