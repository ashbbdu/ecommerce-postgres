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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProduct = void 0;
const client_1 = require("@prisma/client");
const validationSchema_1 = require("../utils/validationSchema");
const prisma = new client_1.PrismaClient();
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body.user;
        const { title, description, image, price, category } = req.body;
        const body = req.body;
        const product = validationSchema_1.productSchema.safeParse(body);
        if (!product.success) {
            return res.status(411).json({
                success: false,
                message: product.error.issues.map(er => er.message)
            });
        }
        const products = yield prisma.product.create({
            data: {
                userId: id,
                title,
                description,
                image,
                price,
                category
            }
        });
        return res.status(200).json({
            success: false,
            message: "Product created successfully !",
            products
        });
    }
    catch (error) {
        console.log(error);
        return res.status(411).json({
            success: false,
            message: "Something went wrong !"
        });
    }
});
exports.createProduct = createProduct;
