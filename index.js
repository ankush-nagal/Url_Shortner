const express = require("express")
const path = require('path')
const cookieParser = require("cookie-parser")

require('dotenv').config();
const { connectToMongoDB } = require("./connect") 

const {restrictToLoggedinUserOnly, checkAuth} = require("./middlewares/auth")

const URL = require('./models/url')
// const user = require("./models/user")

const urlRoute = require('./routes/url')
const staticRoute = require('./routes/staticRouter')
const userRoute = require("./routes/user")


const app = express();
const PORT = process.env.PORT || 3001;
connectToMongoDB(process.env.MONGO_URL);



// connectToMongoDB("mongodb://127.0.0.1:27017/short_url")
//     .then(() => { console.log("Mongodb connected") })

app.set("view engine", "ejs")
app.set("views", path.resolve("./views"))

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())

app.use("/url",restrictToLoggedinUserOnly, urlRoute)
// app.use("/url", urlRoute);
app.use("/user",userRoute)
app.use("/",checkAuth,staticRoute)

// app.get("/test", async (req, res) => {
//     const allUrls = await URL.find({})
//     return res.render('home', {
//         urls: allUrls
//     })

// })

app.get('/url/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate(
        {
            shortId
        }, {
        $push: {
            visitHistory: {
                timestamp: Date.now()
            },
        }
    })
    res.redirect(entry.redirectURL);
})


app.listen(PORT, () => {
    console.log(`Server started at PORT:${PORT}`)
})