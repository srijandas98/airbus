const express = require("express");
const connectDB = require("./config/db");
const path = require("path");
const cors = require("cors");
const session = require('express-session');
const bodyParser = require("body-parser");

const app = express();

// Connect Database

connectDB();

// Init middleware

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json({ extended: false }));
app.use(cors());

app.use(session({secret: 'mySecret', resave: false, saveUninitialized: false}));
app.use(express.static(__dirname + '/public'));
app.set("view engine","ejs");

app.get("/register", (req, res) => {
  res.render("registration");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/sponsors", (req, res) => {
  res.render("sponsors");
});

app.get("/allevents", (req, res) => {
  res.render("allevents");
});

app.get("/", (req, res) => {
  res.render("index");
});


app.get("/home", (req, res) => {
  //console.log(req.session);
  res.render("home",{"token": req.session.token})
});



app.use("/users", require("./routes/users"));
app.use("/auth", require("./routes/auth"));





const port = process.env.PORT || "3000";

app.listen(port, () => console.log(`Server started on port ${port}`));
