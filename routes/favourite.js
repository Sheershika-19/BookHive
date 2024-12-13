const router=require("express").Router();
const User=require("../models/user");
const {authenticateToken}=require("./authUser");

//add book to favourite
router.put("/add-book-to-favourite", authenticateToken,async(req,res)=>{
    try {
        const bookId = req.headers['bookid'] || req.headers['bookId'];
        const id = req.headers['id'];
        const userData=await User.findById(id);
        const isBookFavourite=userData.favourites.includes(bookId);
        if(isBookFavourite)
            return res.status(200).json({message:"Book is already in favourites"});
        await User.findByIdAndUpdate(id, { $push: {favourites:bookId}});
        return res.status(200).json({message:"Book favourited"});
    } catch (error) {
        return res.status(500).json({message:"Internal server error"});
    }
})

router.put("/remove-book-from-favourite", authenticateToken,async(req,res)=>{
    try {
        const bookId = req.headers['bookid'] || req.headers['bookId'];
        const id = req.headers['id'];
        const userData=await User.findById(id);
        const isBookFavourite=userData.favourites.includes(bookId);
        if(isBookFavourite){
            await User.findByIdAndUpdate(id, { $pull: {favourites:bookId}});
        }    
        else{
            return res.status(200).json({message:"Book not present in favourites"});
        }   
        return res.status(200).json({message:"Book removed from favourites"});
    } catch (error) {
        return res.status(500).json({message:"Internal server error"});
    }
})

router.get("/get-fav-books", authenticateToken, async(req,res)=>{
    try {
        const id = req.headers['id'];
        const userData=await User.findById(id).populate("favourites");
        const favBooks=userData.favourites;
        return res.status(200).json({status:"Success",data:favBooks});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal server error"}); 
    } 
})

module.exports=router;
