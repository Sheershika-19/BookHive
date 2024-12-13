const router=require("express").Router();
const User=require("../models/user");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const {authenticateToken}=require("./authUser");

//sign-up

router.post("/sign-up",async(req,res)=>{
    try {
        const {username,email,password,address}=req.body;

        if(username.length < 4) 
            return res.status(400).json({message:"Username should be greater than 3"});
        const existingUsername=await User.findOne({username: username});
        if(existingUsername)
            return res.status(400).json({message:"Username already exists"});
        const existingEmail=await User.findOne({email: email});
        if(existingEmail)
            return res.status(400).json({message:"Email already used"});
        if(password.length < 5)
            return res.status(400).json({message:"password should be greater than 5"}); 
        
        const hashPass=await bcrypt.hash(password,10);
        const newUser=new User({
            username: username,
            email: email,
            password: hashPass,
            address: address,
        });

        await newUser.save();
        return res.status(200).json({message:"Signed up successfully"});
    } catch (error) {
       res.status(500).json({message:"Internal error server"}); 
    }
})

//sign-in

router.post("/sign-in",async(req,res)=>{
    try {
        const {username,password}=req.body;

        const existingUser=await User.findOne({username});
        if(!existingUser)
            res.status(400).json({message:"Invalid credentials"});
        await bcrypt.compare(password,existingUser.password,(err,data)=>{
            if(data){
                const authClaims=[
                    {name: existingUser.name},
                    {role: existingUser.role},
                ];
                const token=jwt.sign({authClaims},"bookStore123",{
                    expiresIn:"30d",
                });
                return res.status(200).json({
                    id: existingUser._id,
                    role:existingUser.role,
                    token:token});
            }
            else{
                res.status(400).json({message:"Incorrect password"});
            }
        })
    } catch (error) {
       res.status(500).json({message:"Internal error server"}); 
    }
})

router.get("/get-user-info",authenticateToken, async(req,res)=>{
    try {
       const {id}=req.headers;
       const data=await User.findById(id).select("-password");
       return res.status(200).json(data); 
    } catch (error) {
        res.status(500).json({message:"Internal error server"}); 
    }
})

router.put("/update-address", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const { address } = req.body;
        
        if (!address) {
            return res.status(400).json({ message: "Address is required" });
        }
        const updatedUser = await User.findByIdAndUpdate(id, { address }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "Address updated successfully" });
    } catch (error) {
        console.error("Error updating address:", error);
        res.status(500).json({ message: `Internal server error error:${error}` });
    }
});
module.exports=router;