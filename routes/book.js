const router=require("express").Router();
const User=require("../models/user");
const jwt=require("jsonwebtoken");
const Book=require("../models/book");
const {authenticateToken}=require("./authUser");

//add-book by admin
router.post("/add-book", authenticateToken, async (req,res) => {
    try {
        const {id}=req.headers;
        const user=await User.findById(id);
        if(!user || user.role!== "admin"){
            return res.status(400).json({message:"You can't add the book"});
        }
        const book=new Book ({
            url : req.body.url,
            title : req.body.title,
            author : req.body.author,
            price : req.body.price,
            desc : req.body.desc,
            language : req.body.language,
        });
        await book.save();
        res.status(200).json({message:"Book added successfully"});
    } catch (error) {
        res.status(500).json({message:"Internal error server"}); 
    }
})

//get all books
router.get("/get-all-books", async(req,res)=>{
    try {
       const books=await Book.find().sort({createdAt : -1});
       return res.status(200).json({status:"Success",data:books});  
    } catch (error) {
        res.status(500).json({message:"Internal error server"}); 
    }
})

router.get("/get-recent-books", async(req,res)=>{
    try {
       const books=await Book.find().sort({createdAt : -1}).limit(4);
       return res.status(200).json({status:"Success",data:books});  
    } catch (error) {
        res.status(500).json({message:"Internal error server"}); 
    }
})

router.get("/get-book-by-id/:id", async(req,res)=>{
    try {
        const {id}=req.params;
        const book=await Book.findById(id);
        return res.status(200).json({status:"Sucsess",data:book});
    } catch (error) {
        res.status(500).json({message:"Internal error server"});
    }
})

module.exports=router;
