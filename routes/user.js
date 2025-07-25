const express = require("express");
const {handleUserLogin} = require("../controllers/user")
const {handleUserSignup} = require("../controllers/user")

const router = express.Router();



router.post('/',handleUserSignup)
router.post('/login',handleUserLogin)
router.get("/logout", (req, res) => {
    res.clearCookie("uid");
    return res.redirect("/login");
});


module.exports = router
     