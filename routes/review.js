const express = require('express');
const router = express.Router();
const Form = require('../models/Form');
require('dotenv').config();
const fetchuser= require('../middleware/fetchuser')

// Middleware to parse JSON data
router.use(express.json());


router.post('/submitForm',fetchuser,async (req, res) => {
    try {
        // Destructure fields from req.body
        const { overall,Service_Type,quality,timeline,support,money,msg } = req.body;
        // Check if all required fields are provided
        if (!overall || !Service_Type ||!quality || !timeline || !support || !money || !msg  ) {
            return res.status(400).json({ error: 'All fields are required!' });
        }

        const  user_Id=req.user.id;
        const  user_Name=req.user.name;
        // console.log(id);
        // Create a new Form document
        const form = new Form({
            overall,
            quality,
            timeline,
            money,
            support,
            msg,
            user_Id,
            user_Name,
            Service_Type
        })
        // Save the document to the database
        await form.save();

        // Send success response
        return res.status(201).json({ form, message: "User created successfully!" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "An error occurred while saving the form!" });
    }
});

module.exports = router;
