import express from "express";
import { addRating } from "../controllers/ReviewAndRating";
import { auth, isUser } from "../middlewares/Auth";

const router = express.Router();

router.post("/add-rating" , auth , isUser , addRating)

export default router;