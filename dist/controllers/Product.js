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
exports.getAllProducts = exports.deleteProduct = exports.updateProduct = exports.createProduct = void 0;
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
            success: true,
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
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body.user;
        const { title, description, image, price, category, productId } = req.body;
        const body = req.body;
        const product = validationSchema_1.productSchema.safeParse(body);
        if (!product.success) {
            return res.status(411).json({
                success: false,
                message: product.error.issues.map(er => er.message)
            });
        }
        const products = yield prisma.product.update({
            data: {
                title,
                description,
                image,
                price,
                category,
            },
            where: {
                id: productId,
                userId: id
            }
        });
        return res.status(200).json({
            success: true,
            message: "Product updated successfully !",
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
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body.user;
        const { productId } = req.params;
        if (!productId) {
            return res.status(401).json({
                success: false,
                message: "Invalid Product Id !"
            });
        }
        const deleteProduct = yield prisma.product.delete({
            where: {
                id: parseInt(productId),
                userId: id
            }
        });
        if (deleteProduct) {
            return res.status(401).json({
                success: false,
                message: "User Deleted Successfully !"
            });
        }
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: "Something went wrong !"
        });
    }
});
exports.deleteProduct = deleteProduct;
// API's for users
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, category, page } = req.query;
        console.log(title, description, category);
        const users = yield prisma.product.findMany({
            where: {
                OR: [
                    {
                        title: {
                            contains: String(title).toLowerCase().replace(" ", "")
                        }
                    },
                    {
                        description: {
                            contains: String(description).toLowerCase().replace(" ", "")
                        }
                    },
                    {
                        category: {
                            contains: String(category).toLowerCase().replace(" ", "")
                        }
                    }
                ],
            },
            skip: Number(page) * 10,
            take: 10
            // orderBy : {
            //      updatedAt : { sort: 'asc', nulls: 'last' }
            // },
        });
        return res.status(200).json({
            success: true,
            message: "Users fetched successfully !",
            users
        });
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: "Something went wrong !"
        });
    }
});
exports.getAllProducts = getAllProducts;
