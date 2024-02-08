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
exports.signin = exports.signup = exports.sendOtp = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const validationSchema_1 = require("../utils/validationSchema");
const otp_generator_1 = __importDefault(require("otp-generator"));
const mailSender_1 = require("../utils/mailSender");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv").config();
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
        console.log(existingUser, "exi");
        if ((existingUser === null || existingUser === void 0 ? void 0 : existingUser.email) === email) {
            return res.status(411).json({
                success: false,
                message: "User is alreay registered with us !"
            });
        }
        const otp = otp_generator_1.default.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
        const send = yield prisma.otp.create({
            data: {
                otp: otp,
                userEmail: email
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
            otp
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
    var _a;
    try {
        const body = req.body;
        const { firstName, lastName, password, email, isAdmin, otp } = req.body;
        const signup = validationSchema_1.signupSchema.safeParse(body);
        if (!signup.success) {
            return res.status(411).json({
                success: false,
                message: signup.error.issues.map(er => er.message)
            });
        }
        if (!firstName || !lastName || !password || !email || !otp) {
            return res.status(411).json({
                success: false,
                message: "Please fill all the details"
            });
        }
        const getOpt = yield prisma.otp.findMany({
            where: {
                userEmail: email
            }
        });
        //Todo: make a check for existing user 
        const slicedOtp = (_a = getOpt.slice(-1)[0]) === null || _a === void 0 ? void 0 : _a.otp;
        console.log(slicedOtp, "sliced");
        if (parseInt(slicedOtp) !== otp) {
            return res.status(411).json({
                success: false,
                message: "Invalid Otp"
            });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = yield prisma.user.create({
            data: {
                email,
                firstName,
                lastName,
                password: hashedPassword,
                isAdmin,
                profilePic: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
            }
        });
        return res.status(200).json({
            success: false,
            message: "User created successfully !",
            user
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
exports.signup = signup;
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const { email, password } = req.body;
        console.log(typeof password, password, "value");
        const login = validationSchema_1.loginSchema.safeParse(body);
        if (!login.success) {
            return res.status(411).json({
                success: false,
                message: login.error.issues.map(er => er.message)
            });
        }
        if (!email || !password) {
            return res.status(411).json({
                success: false,
                message: "Please fill all the details"
            });
        }
        const user = yield prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if (!user) {
            return res.status(411).json({
                success: false,
                message: "User does not exist !"
            });
        }
        const payload = {
            id: user === null || user === void 0 ? void 0 : user.id,
            fistName: user === null || user === void 0 ? void 0 : user.firstName,
            lastName: user === null || user === void 0 ? void 0 : user.lastName,
            email: user === null || user === void 0 ? void 0 : user.email,
            profilePic: user === null || user === void 0 ? void 0 : user.profilePic,
            createdAt: user === null || user === void 0 ? void 0 : user.createdAt
        };
        if (yield bcrypt_1.default.compare(password, String(user === null || user === void 0 ? void 0 : user.password))) {
            const token = yield jsonwebtoken_1.default.sign(payload, "ECOMMERCEWEB");
            res.status(200).json({
                success: true,
                message: "User logged in successfully !",
                token,
                user
            });
        }
        else {
            return res.status(411).json({
                success: false,
                message: "Invalid Password !"
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
exports.signin = signin;
// module.exports = {
//     signup
// }
