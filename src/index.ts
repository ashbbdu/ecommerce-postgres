import express from "express"
import authRotues from "./rotues/authRotues"
import productRoutes from "./rotues/productRoutes"
import reviewAndRatingRoutes from "./rotues/ratingAndReviewRoutes"
const app = express();
const cors = require('cors')
app.use(express.json())
app.use(cors())
require("dotenv").config()

const PORT = process.env.PORT || 5000;

app.get("/" , (req , res) => {
    res.send("App is up and running")
})

app.use("/api/v1/auth" , authRotues)
app.use("/api/v1/product" , productRoutes)
app.use("/api/v1/rating" , reviewAndRatingRoutes )

app.listen(PORT , () => {
    console.log(`App is running on Port ${PORT}`);
})
