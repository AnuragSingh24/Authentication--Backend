// auth , isStudent , isAdmin

const jwt = require("jsonwebtoken");

require("dotenv").config();


exports.auth = (req, res, next) => {
    try {


      console.log("cookie", req.cookies.token);
      console.log("body" , req.body.token);
      console.log("Header",req.header("Authorization"));

        //extract jwt token
        const token = req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer" , "");  //Authorization: Bearer <token>  we remove the bearer with empty string
        if (!token) {                                                       //key                   //value
            return res.status(401).json({
                success: false,
                message: "No token provided"
            })
        }

        //verify the token
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            console.log(payload);
            req.user = payload; //req ke andar paylaod lo store kar diya
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            })
        }
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Something went wrong ,while verifying the token'
        })
    }

}

exports.isStudent = (req, res, next) => {
    try {
        if (req.user.role !== "Student") { //phir hamne req user role nikal liye agar equal hai to wo student hai 
            return res.status.json({
                success: false,
                message: "This is the protected route for student"
            })
        }
        next();
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'user role cannot verified'
        })

    }
}

exports.isAdmin = (req, res, next) => {
    try {
        if (req.user.role !== "Admin") { //phir hamne req user role nikal liye agar equal hai to wo student hai 
            return res.status(401).json({
                success: false,
                message: "This is the protected route for student"
            });
        }
        next();
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'user role cannot verified'
        })

    }
}