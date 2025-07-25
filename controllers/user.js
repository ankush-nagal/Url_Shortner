const bcrypt = require("bcrypt");
const User = require("../models/user")
const { setUser } = require("../service/auth")
const { v4: uuidv4 } = require("uuid");



async function handleUserSignup(req, res) {
    const { name, email, password } = req.body;

   
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.render("signup", { error: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10); 

    await User.create({
        name,
        email,
        password: hashedPassword
    });

    return res.redirect("/login"); 
}

// Login
async function handleUserLogin(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.render("login", { error: "Invalid email or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return res.render("login", { error: "Invalid email or password" });
    }

    const token = setUser(user);
    res.cookie("uid", token, { httpOnly: true });
    return res.redirect("/");
}





module.exports = {
    handleUserLogin,
    handleUserSignup
}