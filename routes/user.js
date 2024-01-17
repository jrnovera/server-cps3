//[SECTION] Dependencies and Modules
const express = require("express");
const userController = require("../controllers/user");
const auth = require("../auth");

const { verify, verifyAdmin } = auth;

//[SECTION] Routing Component
const router = express.Router();

//[SECTION] Routes - POST
router.post("/checkEmail", (req, res) => {
  userController
    .checkEmailExists(req.body)
    .then((resultFromController) => res.send(resultFromController));
});

//[SECTION] Route for user registration
router.post("/register", (req, res) => {
  userController
    .registerUser(req.body)
    .then((resultFromController) => res.send(resultFromController));
});

//[SECTION] Route for user authentication
router.post("/login", userController.loginUser);

//[ACTIVITY] Route for retrieving user details
//router.post("/details", verify, userController.getProfile);

//Refactor
router.get("/details", verify, userController.getProfile);

//[SECTION] Route to enroll user to a course
// router.post("/enroll", verify, userController.enroll);

//[ACTIVITY] Get Logged User's Enrollments
router.get("/getEnrollments", verify, userController.getEnrollments);

//ChatGPT Generated Codes

//[SECTION] Reset Password
router.put("/reset-password", verify, userController.resetPassword);

//[SECTION] Update Profile
router.put("/profile", verify, userController.updateProfile);

//[ACTIVITY] Update enrollment status route
router.put("/enrollmentStatusUpdate", userController.updateEnrollmentStatus);

//[ACTIVITY] Update Admin route
router.put(
  "/updateAdmin",
  verify,
  verifyAdmin,
  userController.updateUserAsAdmin
);

//[SECTION] Export Route System
module.exports = router;