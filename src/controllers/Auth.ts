import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express"
import { signupSchema } from "../utils/validationSchema";
import otpGenerator from "otp-generator"
import { mailSender } from "../utils/mailSender";

const prisma = new PrismaClient();

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
            where : {
                email : email
            }
        })
        if(existingUser) {
            return res.status(411).json({
                success: false,
                message: "User is alreay registered with us !"
            })
        }

        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });

        const send = await prisma.otp.create({
            data: {
                otp: otp,
                userEmail: "ashishsrivat2@gmail.com"
            }
            
        })
       
        mailSender("OTP Send Successfully" , email , 
        `Hi , 
        Hello , Greeting of the day.
        Thanks for registering with us.
        Please enter otp ${otp} to continue with the signup process.
        Thanks
        `)
        
        res.status(200).json({
            success: true,
            message: "Otp sent successfully !",
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
        const { firstName, lastName, password, email, role, otp } = req.body;
        const signup = signupSchema.safeParse(body);
        console.log(signup);

        if (!signup.success) {
            return res.status(411).json({
                success: false,
                message: signup.error.issues.map(er => er.message)
            })
        }
        if (!firstName || !lastName || !password || !email || otp) {
            return res.status(411).json({
                success: false,
                message: "Please fill all the details"
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