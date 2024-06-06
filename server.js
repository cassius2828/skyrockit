const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");

// Middleware
const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require("express-session");

// Routers
const authCtrl = require("./controllers/auth.js");
const applicationCtrl = require("./controllers/applications.js");

// Custom Middleware
const isSignedIn = require("./middleware/pass-user-to-view.js");
const passUserToView = require("./middleware/pass-user-to-view.js");

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
// app.use(morgan("dev"));

// Static Files
// Moved static files middleware to be closer to other app.use calls for organization
const staticDir = path.join(__dirname, "public");
app.use(express.static(staticDir));

// Session Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Custom Middleware to make the logged-in user available globally
app.use(passUserToView);

///////////////////////////
// Routes
///////////////////////////

// Landing Page
app.get("/", (req, res) => {
  console.log(req.session);
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

// VIP Lounge
app.get("/vip-lounge", (req, res) => {
  if (req.session.user) {
    res.send(`Welcome to the party ${req.session.user.username}.`);
  } else {
    res.send("Sorry, no guests allowed.");
  }
});

// Prefixed Routes
app.use("/auth", authCtrl);
app.use("/users/:userId/applications", applicationCtrl);

///////////////////////////
// Start Server
///////////////////////////
app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
