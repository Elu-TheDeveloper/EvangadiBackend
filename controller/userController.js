//importing databse connection
const dbConnection = require("../db/dbConfig")
const { StatusCodes } = require('http-status-codes'); 
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


async function register(req,res) {
    const {username, firstname,lastname, email, password }=req.body
    if(!username||!firstname||!lastname||!email||!password){
        return res.status(StatusCodes.BAD_REQUEST).json({msg:"please enter required all information"})
    }

    try {

        const [user] = await dbConnection.query("select username,userid from users where username = ? or email = ? ",[username,email])
        if(user.length>0){
            return res.status(StatusCodes.BAD_REQUEST).json({msg:"you are already registred"})
        }
    
if (password.length<8) {
    return res.status(StatusCodes.BAD_REQUEST).json({msg: "password must be at least 8 characters"})
    
}
//encrypting password 
const salt = await bcrypt.genSalt(10);
const hash = await bcrypt.hash(password, salt);
//

        await dbConnection.query("INSERT INTO users(username,firstname,lastname,email,password)VALUES(?,?,?,?,?)",[username,firstname,lastname,email,hash])

        return res.status(StatusCodes.CREATED).json({msg:"user registered succesfully!"})
        
    } catch (error) {
        console.log(error.message)
       return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:"something error please try later!!"})
    }
}
async function login(req,res) {
const {email, password} = req.body
if(!email || !password){
    return res.status(StatusCodes.BAD_REQUEST).json({msg: "please enter all required fields"});
}
try {

    const [user]= await dbConnection.query("select username,userid,password from users where email = ?",[email]);
    if(user.length==0){
        return res.status(StatusCodes.BAD_REQUEST).json({msg:"Invalid Creditial"})

    }

    //password comprassion
   const isMatch= await bcrypt.compare(password,user[0].password)
   if(!isMatch){
    return res.status(StatusCodes.BAD_REQUEST).json({msg:"Invalid Creditial"})
   }
  const username = user[0].username
  const userid =user[0].userid
  const token =jwt.sign({username,userid}, process.env.JWT_Sign,{expiresIn: "30d"})
  return res.status(StatusCodes.OK).json({msg:"user succesfully login",token,username})

} catch (error) {
    console.log(error.message)
       return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:"something error please try later!!"})
    
}
}
async function checkUser(req,res) {

    const username = req.user.username
    const userid = req.user.userid
    res.status(StatusCodes.OK).json({msg: "the user is valid",username,userid})
}
module.exports = { register, login, checkUser}