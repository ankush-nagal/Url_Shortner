const { getUser } = require("../service/auth");

function restrictToLoggedinUserOnly(req, res, next) {
    const token = req.cookies?.uid;
    if (!token) return res.redirect("/login");

    const user = getUser(token);
    if (!user) return res.redirect("/login");

    req.user = user;
    next();
}

async function checkAuth(req, res, next) {
  const token = req.cookies?.uid;

  try {
    const user = getUser(token);
    req.user = user;
  } catch (err) {
    console.warn("Invalid or missing token");
    req.user = null;
  }

  next();
}

module.exports = {
    restrictToLoggedinUserOnly ,
    checkAuth
}