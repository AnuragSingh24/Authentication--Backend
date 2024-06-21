const bcrypt = require('bcrypt');

const User = require("../Model/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();
//Singup route handler


exports.signup = async (req, res) => {
    try {
        //get data
        const { name, email, password, role } = req.body;
        //check if user already exist
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already Exists',
            });
        }

        //secure password
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10); //hasing string se aap wapas ni aa skate hai 
            //md5 
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: 'Error inn hashing Password',
            });
        }

        //create entry for User
        const user = await User.create({
            name, email, password: hashedPassword, role
        })

        return res.status(200).json({
            success: true,
            message: 'User Created Successfully',
        });

    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'User cannot be registered, please try again later',
        });
    }
}


//login

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        //validate on email and password
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all details carefully',
            })
        }

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found',
            })
        }
        const payload = {
            email: user.email,
            id: user._id,
            role: user.role,
        };


        //verify password and generate jwt token 


        //if user exist than compare password
        //password comes from the user
        //user.password comes from the database
        if (await bcrypt.compare(password, user.password)) {
            //password match
            let token = jwt.sign(payload, process.env.JWT_SECRET,
                {
                    expiresIn: "2h",
                }
            );
            user = user.toObject();
            user.token = token; //crate token is user object in db
            user.password = undefined; // hide the password

            //add cookies

            //three parameter : name , data , option like expires , permissions

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            };
            res.cookie("anuragCookie", token, options).json({
                success: true,
                token,
                user,
                message: "Login Successful",
            });
        } else {
            res.status(403).json({
                success: false,
                message: "Password Incorrect"
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong, please try again later",
        })
    }

}