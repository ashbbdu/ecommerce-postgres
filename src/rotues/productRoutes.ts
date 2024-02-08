import experss from "express"
import { createProduct, deleteProduct, getAllProducts, updateProduct } from "../controllers/Product";
import { auth, isAdmin, isUser } from "../middlewares/Auth";

const router = experss.Router();

router.post("/create-product" , auth , isAdmin , createProduct);
router.put("/update-product" , auth , isAdmin , updateProduct)
router.delete("/delete-product/:productId" , auth , isAdmin , deleteProduct)
router.get("/all-products" , auth , isUser , getAllProducts)

export default router;