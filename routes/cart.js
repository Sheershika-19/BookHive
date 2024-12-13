const router=require("express").Router();
const User=require("../models/user");
const {authenticateToken}=require("./authUser");

//add to cart
router.put("/add-to-cart", authenticateToken, async(req,res)=>{
    try {
        const bookId = req.headers['bookid'] || req.headers['bookId'];
        const id = req.headers['id'];
        const userData=await User.findById(id);
        if(!userData){
            return res.status(404).json({message:"user not found"})
        }
        const isCarted=userData.cart.includes(bookId);
        if(isCarted){
            return res.status(200).json({status:"Success",message:"Book already in cart"});
        }
        await User.findByIdAndUpdate(id,{
            $push: {cart: bookId},
        });
        return res.status(200).json({status:"Success",message:"Book added to cart"});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal error server"});  
    }
})

//rm from cart
router.put("/remove-from-cart/:bookId", authenticateToken,async(req,res)=>{
    try {
        const id = req.headers['id'];
        const bookId = req.params.bookId;
        const userData=await User.findById(id);
        if(!userData){
            return res.status(400).json({message:"user not found"})
        }
        if (!bookId) {
            return res.status(400).json({ message: "Missing bookId in request parameters" });
        }
        const isCarted=userData.cart.includes(bookId);
        if(!isCarted){
            return res.status(404).json({message:"Book not in cart"});
        }
        await User.findByIdAndUpdate(id,{
            $pull: {cart: bookId},
        });
        return res.status(200).json({status:"Success",message:"Book removed from cart"});
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal error server"});
    }
})

router.get("/get-user-cart", authenticateToken, async (req,res)=>{
    try {
        const id = req.headers['id'];
        const userData=await User.findById(id).populate("cart");
        const cart=userData.cart.reverse();
        if(!userData)
            return res.status(404).json({message:"User not found"});
        return res.status(200).json({status:"Success",data:cart});
    } catch (error) {
       res.status(500).json({message:"Internal server error"}); 
    }
})


module.exports=router;