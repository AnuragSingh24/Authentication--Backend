const express = require("express");
const router = express.Router();
const User = require("../Model/User");
const { login, signup } = require("../controller/Auth");
const { auth, isStudent, isAdmin } = require("../middleware/auth");

router.post("/login", login);
router.post("/signup", signup);

//protected route


//testing route
router.get("/test", auth, (req, res) => {
    res.json({
        success: true,
        message: "Welcome to the protected route for tests"
    });
});





//and apka batana hoga ki is path me kon kon se middleware use huye hai
router.get("/student", auth, isStudent, (req, res) => {
    res.json({
        success: true,
        message: "Welcome to the protected route for student"
    });
});

router.get("/admin", auth, isAdmin, (req, res) => {
    res.json({
        success: true,
        message: "Welcome to the protected route for Admin"
    });
});


router.get("/getEmail" , auth  , async (req, res)=>{


    try {
    const id =  req.user.id;
    const user = await User.findById(id);
    res.status(200).json({
        success: true,
        user  : user,
        message: "Welcome to the protected route for Email"
    });

        
    } catch (error) {
        res.status(500).json({
            success: false,
            error  : error.message,
            message: "Fat gya code"
        });
    }
    
    
})

module.exports = router;