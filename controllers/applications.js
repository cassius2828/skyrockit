const express = require("express");
const router = express.Router();

const UserModel = require("../models/user");

router.get("/", async (req, res) => {
  // get the desired user
  const currentUser = await UserModel.findById(req.session.user._id);
  //   access the applications schema in the desired user
  const applications = currentUser.applications;
  //   pass this data to our view
  res.render("applications/index.ejs", { applications });
});

// */user/:userId/applications -- the full route
router.post("/", async (req, res) => {
  try {
    console.log(req.body);
    // select the user by the session
    const currentUser = await UserModel.findById(req.session.user._id);

    // push the form data into the array of the embedded schema
    currentUser.applications.push(req.body);
    console.log(currentUser, " <-- current user info");
    // ! we have to tell our db that we changed the obj
    // * await currentUser.save()
    await currentUser.save();
    res.redirect(`/users/${currentUser._id}/applications`);
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
});

// get a new applicaiton
// */user/:userId/applications/new -- the full route
router.get("/new", (req, res) => {
  res.render("applications/new.ejs");
});

// get specific application
// */user/:userId/applications/:applicationId -- the full route
router.get("/:applicationId", async (req, res) => {
  // get the desired user
  const currentUser = await UserModel.findById(req.session.user._id);
  //   access the applications schema in the desired user
  const app = currentUser.applications.id(req.params.applicationId);
  //   pass this data to our view
  res.render("applications/show.ejs", { app });
});

module.exports = router;
