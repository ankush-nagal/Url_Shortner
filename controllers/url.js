const shortid = require("shortid")
const URL = require('../models/url')

async function handleGenerateNewShortURL(req, res) {
    const body = req.body;
    if (!body.url) return res.status(400).json({ error: "URL is required" });

    const shortId = shortid(8);
    await URL.create({
        shortId: shortId,
        redirectURL: body.url,
        visitHistory: [],
        createdBy: req.user._id,  // ensure req.user is set by middleware
    });

    return res.render("home", { id: shortId });
}

module.exports = {
    handleGenerateNewShortURL
}