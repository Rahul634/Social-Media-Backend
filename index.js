const express = require("express")
const app = express()
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const helmet = require("helmet")
const morgan = require("morgan")
const cors = require("cors")

const userRoute = require("./routes/users")
const authRoute = require("./routes/auth")
const postRoute = require("./routes/post")
dotenv.config()

// mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true}, () => {
//     console.log("Connected to database")
// })
mongoose.connect(
    process.env.MONGO_URL,
    {useNewUrlParser: true, useUnifiedTopology: true},
  )
  .then(()=>console.log('connected'))
  .catch(e=>console.log(e));
//middleware
app.use(express.json())
app.use(helmet())
app.use(morgan("common"))
app.use(cors())

app.use("/api/users", userRoute)
app.use("/api/auth", authRoute)
app.use("/api/posts", postRoute)

app.get("/", (req, res)=> {
    res.send("welcome to home page")
})
app.listen(8800, () => {
    console.log("Server running on port 8800")
})