"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Product_1 = require("../controllers/Product");
const Auth_1 = require("../middlewares/Auth");
const router = express_1.default.Router();
router.post("/create-product", Auth_1.auth, Auth_1.isAdmin, Product_1.createProduct);
exports.default = router;
