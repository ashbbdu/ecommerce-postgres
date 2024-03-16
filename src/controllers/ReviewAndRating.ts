import { PrismaClient, Rating } from "@prisma/client";
import { Request, Response } from "express";
const prisma = new PrismaClient();
export const addRating = async (req: Request, res: Response) => {
    try {
        const { id } = req.body.user;     
        const { review , rating , productId } = req.body;
        if(!review || !rating) {
            return res.status(411).json({
                success: false,
                message: "Please fill all the details!"
            })
        }

        const ratings = await prisma.reviewAndRating.create({
            data : {
                userId : id,
                productId : productId,
                review : review,
                rating : Rating.ONE || Rating.TWO
            }
        })
        res.status(200).json({
            success : true,
            message : "Product Rated Successfully !",
            ratings
        })
    } catch(error) {
        console.log(error);
        return res.status(411).json({
            success: false,
            message: "Something went wrong !"
        })
    }
}


// export const getRatingofProduct = async (req: Request, res: Response) => {
//     try {
//         const { productId } = req.body;
//         const reviews = await prisma.reviewAndRating
//     } catch (error) {
//         return res.status(411).json({
//             success: false,
//             message: "Something went wrong"
//         })
//     }
// }