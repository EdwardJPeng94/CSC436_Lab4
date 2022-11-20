var express = require("express");

var app = express();

require("./setupMongo")();

app.use(express.json());

// middleware function here to append a trace header to a request
// app.use(function (req, res, next) {
//   req.traceId = uuidv4();
//   next();
// });

app.use("/auth", require("./routes/auth"));
app.use("/post", require("./routes/post"));

module.exports = app;
