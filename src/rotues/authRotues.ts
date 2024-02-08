import express from "express"
import { sendOtp, signin, signup } from "../controllers/Auth"

const router = express.Router();

router.post("/signup" , signup)
router.post("/sendotp" , sendOtp)
router.post("/signin" , signin)
router.get("/test" , (req, res) => {
    res.send("<h1>test route</h1>")
})

export default router

