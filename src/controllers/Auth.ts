import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express"
import bcrypt from "bcrypt"
import { loginSchema, signupSchema } from "../utils/validationSchema";
import otpGenerator from "otp-generator"
import { mailSender } from "../utils/mailSender";
import jwt from "jsonwebtoken"
require("dotenv").config()


const prisma = new PrismaClient();

interface Signup {
    firstName : string,
    lastName : string,
    password : string,
    email : string,
    isAdmin : boolean,
    otp : number
}

export const sendOtp = async (req: Request, res: Response) => {
    try {
        const email: string = req.body.email;
        if (!email) {
            return res.status(411).json({
                success: false,
                message: "Invalid Input"
            })
        }

        const existingUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
        console.log(existingUser , "exi");
        
        if (existingUser?.email === email) {
            return res.status(411).json({
                success: false,
                message: "User is alreay registered with us !"
            })
        }

        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });

        const send = await prisma.otp.create({
            data: {
                otp: otp,
                userEmail: email
            }

        })

        mailSender("OTP Send Successfully", email,
            `Hi , 
        Hello , Greeting of the day.
        Thanks for registering with us.
        Please enter otp ${otp} to continue with the signup process.
        Thanks
        `)

        res.status(200).json({
            success: true,
            message: "Otp sent successfully !",
            otp
        })

    } catch (error) {
        console.log(error, "error");
        return res.status(411).json({
            success: false,
            message: "Something went wrong !"
        })
    }
}


export const signup = async (req: Request, res: Response) => {
    try {
        const body = req.body;
        const { firstName , lastName, password, email, isAdmin, otp } : Signup = req.body;
        const signup = signupSchema.safeParse(body);

        if (!signup.success) {
            return res.status(411).json({
                success: false,
                message: signup.error.issues.map(er => er.message)
            })
        }
        if (!firstName || !lastName || !password || !email || !otp) {
            return res.status(411).json({
                success: false,
                message: "Please fill all the details"
            })
        }
        const getOpt = await prisma.otp.findMany({
            where: {
                userEmail: email
            }
        })
        console.log("------------------------");

        const slicedOtp = getOpt.slice(-1)[0].otp;
        console.log(slicedOtp , "sliced");
        

        if (parseInt(slicedOtp) !== otp) {
            return res.status(411).json({
                success: false,
                message: "Invalid Otp"
            })
        }
        const hashedPassword = await bcrypt.hash(password , 10)
        const user = await prisma.user.create({
            data: {
                email,
                firstName,
                lastName,
                password : hashedPassword,
                isAdmin,
                profilePic: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
            }
        })

        return res.status(200).json({
            success: false,
            message: "User created successfully !",
            user
        })
    } catch (error) {
        console.log(error, "error");
        return res.status(411).json({
            success: false,
            message: "Something went wrong !"
        })
    }
}

export const signin = async (req: Request, res: Response) => {
    try {
        const body = req.body;
        const {email , password} = req.body
        console.log(typeof password , password , "value");
        
        const login = loginSchema.safeParse(body);

        if (!login.success) {
            return res.status(411).json({
                success: false,
                message: login.error.issues.map(er => er.message)
            })
        }
        if (!email || !password) {
            return res.status(411).json({
                success: false,
                message: "Please fill all the details"
            })
        }

        const user = await prisma.user.findUnique({
            where : {
                email : email
            }
        })
        
        console.log(user , "user");
        const payload = {
            fistName : user?.firstName,
            lastName : user?.lastName,
            email : user?.email,
            profilePic :  user?.profilePic,
            createdAt :  user?.createdAt
        }
        
        if(await bcrypt.compare(password , String(user?.password))) {
            const token = await jwt.sign(payload , "ECOMMERCEWEB")
            res.status(200).json({
                success : true,
                message : "User logged in successfully !",
                token,
                user
            })
        } else {
            return res.status(411).json({
                success: false,
                message: "Invalid Password !"
            })
        }
        

    } catch (error) {
        console.log(error, "error");
        return res.status(411).json({
            success: false,
            message: "Something went wrong !"
        })
    }
}


// module.exports = {
//     signup
// }