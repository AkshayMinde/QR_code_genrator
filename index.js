const express = require('express');
const ejs = require('ejs');

const dotenv = require('dotenv');
const qrcode = require('qrcode');
const mongoose = require('mongoose');

const app = express();
dotenv.config();

// ! mongoose setup
mongoose.connect(process.env.MONGODB_URI, {useNewURlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log('database connected');
})
.catch((error) => {
    console.log(error);
})

const urlRouter = require("./routes/url.routes");
const indexRouter = require("./routes/index.routes");
const diffQrRouter = require("./routes/url-sameWebsite.routes")

app.use(express.urlencoded({extended:true}));
// ? to use json format
app.use(express.json());
// ? to remove ejs extension
app.set("view engine", "ejs");
// ? to access public files like css
app.use(express.static('public'));

app.use('/', indexRouter);
app.use('/api', urlRouter);
app.use('/api', diffQrRouter);

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`server is connected on ${PORT}`);
})