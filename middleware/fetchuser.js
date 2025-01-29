const jwt = require('jsonwebtoken');
const secKey=process.env.secKey;

const fetchuser=async(req,res,next)=>{
       const token=req.header('Auth-token')  
       console.log(token)   
        if(!token) return res.status(401).json({ message: 'No token, authorization denied'});

        try {
            // bcrypt.verified
            const verified =  jwt.verify(token,secKey)
            // console.log(verified)
            req.user= verified.user;
            // console.log(req.user)
            next()
        } catch (error) {
            res.status(401).json({ message: 'Token is not valid' });
            console.log("Fetch user error",error) 
        }
}

module.exports= fetchuser;