"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signup = exports.sendOtp = void 0;
const client_1 = require("@prisma/client");
const validationSchema_1 = require("../utils/validationSchema");
const otp_generator_1 = __importDefault(require("otp-generator"));
const mailSender_1 = require("../utils/mailSender");
const prisma = new client_1.PrismaClient();
const sendOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        if (!email) {
            return res.status(411).json({
                success: false,
                message: "Invalid Input"
            });
        }
        const existingUser = yield prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if (existingUser) {
            return res.status(411).json({
                success: false,
                message: "User is alreay registered with us !"
            });
        }
        const otp = otp_generator_1.default.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
        const send = yield prisma.otp.create({
            data: {
                otp: otp,
                userEmail: "ashishsrivat2@gmail.com"
            }
        });
        (0, mailSender_1.mailSender)("OTP Send Successfully", email, `Hi , 
        Hello , Greeting of the day.
        Thanks for registering with us.
        Please enter otp ${otp} to continue with the signup process.
        Thanks
        `);
        res.status(200).json({
            success: true,
            message: "Otp sent successfully !",
        });
    }
    catch (error) {
        console.log(error, "error");
        return res.status(411).json({
            success: false,
            message: "Something went wrong !"
        });
    }
});
exports.sendOtp = sendOtp;
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const { firstName, lastName, password, email, role, otp } = req.body;
        const signup = validationSchema_1.signupSchema.safeParse(body);
        console.log(signup);
        if (!signup.success) {
            return res.status(411).json({
                success: false,
                message: signup.error.issues.map(er => er.message)
            });
        }
        if (!firstName || !lastName || !password || !email || otp) {
            return res.status(411).json({
                success: false,
                message: "Please fill all the details"
            });
        }
    }
    catch (error) {
        console.log(error, "error");
        return res.status(411).json({
            success: false,
            message: "Something went wrong !"
        });
    }
});
exports.signup = signup;
// module.exports = {
//     signup
// }
