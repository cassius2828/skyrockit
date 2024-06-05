const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
// middleware
const methodOverride = require("method-override");
const morgan = require("morgan");

// middleware involving the session obj
const session = require("express-session");

// Routers
const authCtrl = require("./controllers/auth.js");
const applicationCtrl = require("./controllers/applications.js");

// Port
const port = process.env.PORT ? process.env.PORT : "3000";

///////////////////////////
// Connect to MongoDB
///////////////////////////
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

///////////////////////////
// Middleware
///////////////////////////

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
const isSignedIn = require("./middleware/pass-user-to-view.js");
const passUserToView = require("./middleware/pass-user-to-view.js");
// this middleware makes the logged in user var available globally
app.use(passUserToView);

///////////////////////////
// Landing Page
///////////////////////////
app.get("/", (req, res) => {
  console.log(req.session)
  if (req.session.user) {
    // restful routing to /users/:userId/applications
    res.redirect(`/users/${req.session.user._id}/applications`);
  } else {
    // take client to the index page
    res.render("index.ejs", {
      user: req.session.user,
    });
  }
});

///////////////////////////
// VIP Lounge
///////////////////////////
app.get("/vip-lounge", (req, res) => {
  if (req.session.user) {
    res.send(`Welcome to the party ${req.session.user.username}.`);
  } else {
    res.send("Sorry, no guests allowed.");
  }
});

///////////////////////////
// Prefixed Routes
///////////////////////////
app.use("/auth", authCtrl);
app.use("/users/:userId/applications", applicationCtrl);

///////////////////////////
// Start Server
///////////////////////////
app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
