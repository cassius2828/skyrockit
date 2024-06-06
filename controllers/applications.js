const express = require("express");
const router = express.Router();

const UserModel = require("../models/user");

///////////////////////////
// Get all applications
///////////////////////////
router.get("/", async (req, res) => {
  // get the desired user
  const currentUser = await UserModel.findById(req.session.user?._id);
  // access the applications schema in the desired user
  const applications = currentUser.applications;
  // pass this data to our view
  res.render("applications/index.ejs", { applications });
});

///////////////////////////
// Post new application
// */user/:userId/applications -- the full route
///////////////////////////
router.post("/", async (req, res) => {
  try {
    console.log(req.body);
    // select the user by the session
    const currentUser = await UserModel.findById(req.session.user?._id);

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

///////////////////////////
// Get new application form
// */user/:userId/applications/new -- the full route
///////////////////////////
router.get("/new", (req, res) => {
  res.render("applications/new.ejs");
});

///////////////////////////
// Get specific application
// */user/:userId/applications/:applicationId -- the full route
///////////////////////////
router.get("/:applicationId", async (req, res) => {
  // get the desired user
  const currentUser = await UserModel.findById(req.session.user?._id);
  // access the applications schema in the desired user
  const app = currentUser?.applications.id(req.params.applicationId);
  // pass this data to our view
  res.render("applications/show.ejs", { app });
});

///////////////////////////
// Get the update form
///////////////////////////
router.get("/:applicationId/edit", async (req, res) => {
  // find user
  const currentUser = await UserModel.findById(req.session.user?._id);
  // get app
  const app = currentUser.applications.id(req.params.applicationId);
  // show app
  console.log(app);
  res.render("applications/edit.ejs", { app });
});

///////////////////////////
// Update application
///////////////////////////
router.put("/:applicationId/edit", async (req, res) => {
  try {
    // return res.send('working')
    // find user
    const currentUser = await UserModel.findById(req.session.user?._id);
    // get app
    const app = currentUser.applications.id(req.params.applicationId);
    // show app
    // update app
    app.set(req.body);
    // save changes to currentUser
    await currentUser.save();
    // redirect to show all applications
    return res.redirect("/");
  } catch (error) {
    console.log(`Error occurred in update: ${error}`);
    return res.redirect("/");
  }
});

///////////////////////////
// Delete specific application
///////////////////////////
router.delete("/:applicationId", async (req, res) => {
  try {
    // get the desired user
    const currentUser = await UserModel.findById(req.session.user?._id);
    // access the applications schema in the desired user
    const app = currentUser.applications.id(req.params.applicationId);
    // delete app
    app.deleteOne();
    // save changes to currentUser
    await currentUser.save();
    res.redirect("/");
  } catch (error) {
    console.log(`Error deleting path: ${error}`);
    res.redirect("/:applicationId");
  }
});

module.exports = router;
