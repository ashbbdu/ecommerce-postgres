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
exports.isAdmin = exports.isUser = exports.auth = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv").config();
const prisma = new client_1.PrismaClient();
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        let token = ((_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.token) || ((_b = req === null || req === void 0 ? void 0 : req.header("Authorization")) === null || _b === void 0 ? void 0 : _b.replace("Bearer ", ""));
        if (!token) {
            return res.status(401).json({ success: false, message: "Token Missing" });
        }
        try {
            const decode = yield jsonwebtoken_1.default.verify(token, "secret");
            req.body.user = decode;
        }
        catch (error) {
            return res
                .status(401)
                .json({ success: false, message: "Token is invalid" });
        }
        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: "Please login to perform this action",
        });
    }
});
exports.auth = auth;
const isUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userDetails = yield prisma.user.findUnique({
            where: {
                // auth k sath chlega is liye email isko mil jaega
                email: req.body.user.email
            }
        });
        if (!(userDetails === null || userDetails === void 0 ? void 0 : userDetails.isAdmin)) {
            return res.status(401).json({
                success: false,
                message: "This is a Protected Route for Users",
            });
        }
        next();
    }
    catch (error) {
        return res
            .status(500)
            .json({ success: false, message: `User Role Can't be Verified` });
    }
});
exports.isUser = isUser;
const isAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userDetails = yield prisma.user.findUnique({
            where: {
                // auth k sath chlega is liye email isko mil jaega
                email: req.body.user.email
            }
        });
        if (userDetails === null || userDetails === void 0 ? void 0 : userDetails.isAdmin) {
            return res.status(401).json({
                success: false,
                message: "This is a Protected Route for Admin",
            });
        }
        next();
    }
    catch (error) {
        return res
            .status(500)
            .json({ success: false, message: `User Role Can't be Verified` });
    }
});
exports.isAdmin = isAdmin;
