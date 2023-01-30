const express = require("express");
const ExpressError = require("./expressError")
const cors = require('cors');
var multer = require('multer')
const resume = require("./routes/resume");

const app = express();
app.use(cors());
app.use(express.json());





// const app = express();




app.use("/resume", resume);


app.get("/", function (req, res) {
    return res.json({ "name": "hello" });
});


/** 404 handler */
app.use(function (req, res, next) {
    const err = new ExpressError("Not Found", 404);
    return next(err);
});

/** general error handler */

app.use((err, req, res, next) => {
    res.status(err.status || 500);

    return res.json({
        error: err,
        message: err.message
    });
});


module.exports = app;