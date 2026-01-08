import dotenv from "dotenv";
import connectDB from "../src/config/db.js"
import app from "../src/app.js"

dotenv.config();

connectDB().then(()=>{
    app.listen(process.env.PORT || 3000,()=>{
        console.log(`connection at port :  ${process.env.PORT || 3000}`)
    });
})
.catch((err)=>{
    console.log("DB Connection failed",err);
})