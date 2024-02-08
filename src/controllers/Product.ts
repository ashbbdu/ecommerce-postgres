import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { productSchema } from "../utils/validationSchema";
const prisma = new PrismaClient();
interface Product {
    title : string,
    description : string,
    image : string,
    price : number,
    category : string
}

export const createProduct = async (req : Request , res : Response) => {
    try {
        const {id} = req.body.user;
        const { title , description , image , price , category } : Product = req.body;
        const body = req.body;
        const product = productSchema.safeParse(body);
        if(!product.success) {
            return res.status(411).json({
                success: false,
                message: product.error.issues.map(er => er.message)
            })
        }

        const products = await prisma.product.create({
            data : {
                userId : id,
                title ,
                description,
                image,
                price,
                category
            }
           
        })

        return res.status(200).json({
            success : false,
            message : "Product created successfully !",
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