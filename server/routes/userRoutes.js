const express = require("express");
const User = require("../models/userModel");
const bcrypt = require('bcrypt');
const router = express.Router();

router.post("/register", async (req, res) => {
    try{
        const UserExists = await User.findOne({email:req.body.email});
        if(UserExists){
            res.send({
                success : false,
                message : "Already Exist"
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(req.body.password,salt)
        req.body.password = hashPassword;

        

        const newUser = new User(req.body);
        await newUser.save()
        res.status(201).json({ message: "Username created" })
    } catch(error){
        res.json(error);
    }

});

router.post("/login", async (req, res) => {
    const user = await User.findOne({email:req.body.email});
    if(!user){
        res.send({
            success : false,
            message : "User Doe not Exist,please Register"
        })
    }
    const validPassword = await bcrypt.compare(req.body.password,user.password);
    if(!validPassword){
        return res.send({
            success : false,
            message : "Invalid PassWord"
        })
    }
    res.send({
        success : true,
        message : "User Login"
    })
});


module.exports = router;