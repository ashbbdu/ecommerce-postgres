import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { productSchema } from "../utils/validationSchema";
const prisma = new PrismaClient();
interface Product {
    title: string,
    description: string,
    image: string,
    price: number,
    category: string
}

interface UpdataProduct {
    title: string,
    description: string,
    image: string,
    price: number,
    category: string,
    productId: number
}

export const createProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.body.user;
        const { title, description, image, price, category }: Product = req.body;
        const body = req.body;
        const product = productSchema.safeParse(body);
        if (!product.success) {
            return res.status(411).json({
                success: false,
                message: product.error.issues.map(er => er.message)
            })
        }

        const products = await prisma.product.create({
            data: {
                userId: id,
                title,
                description,
                image,
                price,
                category
            }

        })

        return res.status(200).json({
            success: true,
            message: "Product created successfully !",
            products
        })


    } catch (error) {
        console.log(error);
        return res.status(411).json({
            success: false,
            message: "Something went wrong !"
        })

    }
}

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.body.user;
        const { title, description, image, price, category, productId }: UpdataProduct = req.body;
        const body = req.body;
        const product = productSchema.safeParse(body);
        if (!product.success) {
            return res.status(411).json({
                success: false,
                message: product.error.issues.map(er => er.message)
            })
        }

        const products = await prisma.product.update({
            data: {
                title,
                description,
                image,
                price,
                category,
            },
            where: {
                id: productId,
                userId: id   //error while updating with other user //handled using catch block try to handle the error with proper message insted of Something went wrong
            }

        })

        return res.status(200).json({
            success: true,
            message: "Product updated successfully !",
            products
        })


    } catch (error) {
        console.log(error);
        return res.status(411).json({
            success: false,
            message: "Something went wrong !"
        })

    }
}

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.body.user;
        const { productId } = req.params;
        if (!productId) {
            return res.status(401).json({
                success: false,
                message: "Invalid Product Id !"
            })
        }
        const deleteProduct = await prisma.product.delete({
            where: {
                id: parseInt(productId),
                userId: id
            }
        })
        if (deleteProduct) {
            return res.status(401).json({
                success: false,
                message: "User Deleted Successfully !"
            })
        }
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Something went wrong !"
        })
    }
}


// API's for users
export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const { title, description, category , page } = req.query;
        console.log(title, description, category);

        const products = await prisma.product.findMany({
            include : {
                reviewAndRating : true
                // avgRating can be taken out in frontend but lets make it a backend functionality
            }, 
            where: {
                OR : [
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
            skip : (Number(page) - 1) * 10,
            take : 10
            // orderBy : {
            //      updatedAt : { sort: 'asc', nulls: 'last' }
            // },
            
        });
        const allProducts = await prisma.product.findMany({})
        return res.status(200).json({
            success: true,
            message: "Users fetched successfully !",
            products,
            totalRecords : allProducts.length
        })
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Something went wrong !"
        })
    }
}