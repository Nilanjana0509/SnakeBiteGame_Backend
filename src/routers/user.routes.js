const {Router}=require("express");
const {
    registerUser,
    loginUser,
    checkUser
}=require("../controllers/user.controller")
const router = Router()
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/check").get(checkUser);


module.exports=router;