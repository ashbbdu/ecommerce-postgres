import zod from "zod";

export const signupSchema = zod.object({
    firstName : zod.string({required_error : "First Name is required !"}),
    lastName : zod.string({required_error : "Last Name is required !"}),
    email : zod.string({required_error : "Email is required !"}),
    password : zod.string({required_error : "Password is required !"}),
    otp : zod.number({required_error : "OTP is required !"})
})

export const loginSchema = zod.object({
    email : zod.string({required_error : "Email is required !"}),
    password : zod.string({required_error : "Password is required !"})
})