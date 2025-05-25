const express = require("express")
const router = express.Router()
const authMiddleware = require("../middleware/authenticationMiddleware")

//usercontrollers

const {register, login, checkUser}=require('../controller/userController')
//for register

router.post("/register", register)
    
    //for login

    router.post("/login", login)
        //auth

        router.get("/check",authMiddleware, checkUser)
        
       
    
        
    module.exports = router;