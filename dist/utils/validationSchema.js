"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.signupSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.signupSchema = zod_1.default.object({
    firstName: zod_1.default.string({ required_error: "First Name is required !" }),
    lastName: zod_1.default.string({ required_error: "Last Name is required !" }),
    email: zod_1.default.string({ required_error: "Email is required !" }),
    password: zod_1.default.string({ required_error: "Password is required !" }),
    otp: zod_1.default.number({ required_error: "OTP is required !" })
});
exports.loginSchema = zod_1.default.object({
    email: zod_1.default.string({ required_error: "Email is required !" }),
    password: zod_1.default.string({ required_error: "Password is required !" })
});
