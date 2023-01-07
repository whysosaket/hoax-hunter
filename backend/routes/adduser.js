// Using enviroment variables to save data from being published online
require('dotenv').config();

const expess = require('express');
const router = expess.Router();

// Importing the User model
const User = require('../models/User');

router.route('/createuser')
.post( async (req, res)=>{
    const {name, email, password, cpassword} = req.body;
    try{
        // Check if the user with this email already exists
        let user = await User.findOne({email});
        if(user){
            return res.status(400).send({error: "User already exists!"})
        }
        // Check if the password and confirm password are same
        if(password !== cpassword){
            return res.status(400).send({error: "Passwords do not match!"})
        }
        // Create a new user
        user = await User.create({
            name, email, password
        })
        // Create a token
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        res.json({success, authtoken});
    }catch(error){
        console.log(error.message);
        res.status(500).send("Internal Server Error!");
    }
})

module.exports = router;