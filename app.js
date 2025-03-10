const express=require("express");
const app=express();
const cors=require("cors");
require("dotenv").config();
require("./conn/conn");

const Books=require("./routes/book");
const User=require("./routes/user");
const Favourite=require("./routes/favourite");
const Cart=require("./routes/cart");
const Order=require("./routes/order");

app.use(cors());
app.use(express.json());

app.use("/api/v1",User);
app.use("/api/v1",Books);
app.use("/api/v1",Favourite);
app.use("/api/v1",Cart);
app.use("/api/v1",Order);

app.listen(process.env.PORT ,()=>{
    console.log(`server started ${process.env.PORT}`);
});