import express from "express"
import authRotues from "./rotues/authRotues"
const app = express();
app.use(express.json())
require("dotenv").config()

const PORT = process.env.PORT || 5000;

app.get("/" , (req , res) => {
    res.send("App is up and running")
})

app.use("/api/v1/auth" , authRotues)

app.listen(PORT , () => {
    console.log(`App is running on Port ${PORT}`);
})
