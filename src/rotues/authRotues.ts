import express from "express"
import { sendOtp, signup } from "../controllers/Auth"

const router = express.Router();

router.post("/signup" , signup)
router.post("/sendotp" , sendOtp)
router.get("/test" , (req, res) => {
    res.send("<h1>test route</h1>")
})

export default router

