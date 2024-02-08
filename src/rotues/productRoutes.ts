import experss from "express"
import { createProduct } from "../controllers/Product";
import { auth, isAdmin } from "../middlewares/Auth";

const router = experss.Router();

router.post("/create-product" , auth , isAdmin , createProduct)

export default router;