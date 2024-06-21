const express = require("express");
const app = express();

require('dotenv').config();
const PORT = process.env.PORT || 4000;

const cookie = require("cookie-parser");
app.use(cookie());


app.use(express.json());

require("./config/database").connect();

//route import and mount
const user = require("./Routes/user");
const cookieParser = require("cookie-parser");
app.use("/api/v1", user);

//actuivate

app.listen(PORT, () => {
    console.log(`App is listening at ${PORT}`);
})

app.get("/", (req, res) => {
    res.send("hello world");
})

