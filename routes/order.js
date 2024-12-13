const router = require("express").Router();
const User = require("../models/user");
const Book = require("../models/book");
const Order = require("../models/order");
const { authenticateToken } = require("./authUser");

// Place Order
router.put("/place-order", authenticateToken, async (req, res) => {
    try {
        const userId = req.headers['id']; 
        const cart = req.body.cart;
        if (!cart || !Array.isArray(cart) || cart.length === 0) {
            console.log(cart);
            return res.status(400).json({ status: "error", message: "Invalid cart data" });
        }
        const newOrders = cart.map(bookId => ({
            user: userId,
            book: bookId
        }));
        const orderDocs = await Order.insertMany(newOrders);
        const orderIds = orderDocs.map(order => order._id);
        await User.findByIdAndUpdate(userId, {
            $push: { orders: { $each: orderIds } },
            $pull: { cart: { $in: cart } } 
        });
        return res.status(200).json({ status: "success", message: "Order placed successfully" });
    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/get-order-history", authenticateToken, async(req,res)=>{
    try {
        const id = req.headers['id']; 
        if(!id)
            return res.status(404).json({message:"User not found"});
        const userData=await User.findById(id).populate({
            path:"orders",
            populate: {path:"book"},
        });
        const ordersData=userData.orders.reverse();
        return res.status(200).json({status:"Success",data:ordersData});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
})

router.get("/get-all-orders", authenticateToken, async(req,res)=>{
    try {
        const userData=await Order.find()
         .populate({
            path:"book",
         })
         .populate({
            path:"user",
         })
         .sort({createdAt : -1});
         return res.status(200).json({status:"Success", data: userData});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
})

router.put("/update-status/:id",authenticateToken, async(req,res)=>{
    try {
        const {id}=req.params;
        await Order.findByIdAndUpdate(id, {status:req.body.status});
        return res.status(200).json({status:"Success", message:"Status updated successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
})
module.exports = router;
