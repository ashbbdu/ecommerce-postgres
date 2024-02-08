"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authRotues_1 = __importDefault(require("./rotues/authRotues"));
const productRoutes_1 = __importDefault(require("./rotues/productRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
require("dotenv").config();
const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
    res.send("App is up and running");
});
app.use("/api/v1/auth", authRotues_1.default);
app.use("/api/v1/product", productRoutes_1.default);
app.listen(PORT, () => {
    console.log(`App is running on Port ${PORT}`);
});
