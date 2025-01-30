const express = require('express')
const router =express.Router();
const fetchuser= require('../middleware/fetchuser')
const User=require('../models/User'); 
const { body,validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
const jwt= require('jsonwebtoken')
const mongoose = require('mongoose');
const secKey=process.env.secKey;
require('dotenv').config();

// Create a User using : POST "/api/auth/createUser"
router.post('/createUser',
    [   body('name').isLength({ min: 4 }).withMessage('Username must have at least 4 characters'),
        body('email').isEmail().withMessage('Invalid email address'),
        body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),
    ],
    async (req,res)=> {
        
        const errors= validationResult(req);

        if (!errors.isEmpty())
        {
            return res.status(400).json({error:"Input must have 4 at least character"})
        }
        
        if (mongoose.connection.readyState !== 1) { 
            return res.status(500).json({ message: 'Server is currently down. Please try again later.' });
        }

            try 
            {
                // const salt = await bcrypt.genSalt(10); equivalent to below codw
                // console.log(salt);
                const hashedpassword= await bcrypt.hash(req.body.password,10)
                const user = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: hashedpassword,
                    role:req.body.role,
                  });

                  //Data is returned as Token to user, we can add name, email and pass....
                const data={
                    user:{
                        id:user.id
                    }
                }
                  const token = jwt.sign(data, secKey);
                //   console.log(token)
                await user.save();
                return res.json({token,message:"User created successfully!"});
                
            } catch (error) {
                console.log("Error in Saving User ",error)
                if(error.code===11000)
                    return res.status(400).json({ error: 'Email already exists!' });
            }
            return res.status(500).json({ error: 'Server error' });
    })

// Authenticate a use using Post"/api/auth/login"

router.post('/loginUser',
    [
        body('email').isEmail().withMessage('Invalid email address'),
        body('password').isLength({ min: 5 }).withMessage('Password cant be blank').exists(),
    ],
    async (req,res)=> {
        
        const errors= validationResult(req);

        if (!errors.isEmpty())
            {
                return res.status(400).json({error:"Invalid Credential"})
            }
            
            const{email,password}=req.body;
            // console.log(req.body);
            
            if (mongoose.connection.readyState !== 1)
                 { 
                return res.status(500).json({ error: 'Server is currently down. Please try again later.' });
            }

        try 
        {
            let user=await User.findOne({email});
            if(!user)
                {
                    return res.status(400).json({error:"Invalid credentials. Please Sign up."});
                    // console.log("Success")
                }
                
                const passCompare= await bcrypt.compare(password,user.password)
                if(!passCompare)
                    {
                        return res.status(400).json({error:"Invalid credentials. Please Sign up."});
                    }
                    
                    const data={
                        user:{
                            id:user._id,
                            name:user.name,
                            role: user.role
                        }
                    }
                    const token = jwt.sign(data, secKey);
                    return res.json({token,message:"User logged in successfully!"});
          
        } catch (error) {
		return res.status(500).json({ error: "Internal Server Error" });
            
            // return res.status(400).json({message:"Error..."});
        }
    
    })

    //Get  user details : get
    router.get('/getUser',fetchuser,async (req,res)=> {
          try {
            const userid=req.user.id
            // console.log(userid)
            const user= await User.findById(userid).select("-password")
            res.send(user)
            // console.log(user)
          } catch (error) {
            console.log(error.message);
            res.status(500).send("Internal error occured!")
          }
        })

module.exports= router;