const User = require("../models/user");
const Course = require("../models/product");
const bcrypt = require("bcrypt");
const auth = require("../auth");

//[SECTION] Check if the email already exists

module.exports.checkEmailExists = (reqBody) => {
  // The result is sent back to the frontend via the "then" method found in the route file
  return User.find({ email: reqBody.email })
    .then((result) => {
      // The "find" method returns a record if a match is found
      if (result.length > 0) {
        return true;

        // No duplicate email found
        // The user is not yet registered in the database
      } else {
        return false;
      }
    })
    .catch((err) => res.send(err));
};

//[SECTION] User registration
module.exports.registerUser = (reqBody) => {
  // Creates a variable "newUser" and instantiates a new "User" object using the mongoose model
  // Uses the information from the request body to provide all the necessary information
  let newUser = new User({
    firstName: reqBody.firstName,
    lastName: reqBody.lastName,
    email: reqBody.email,
    mobileNo: reqBody.mobileNo,
    password: bcrypt.hashSync(reqBody.password, 10),
  });

  // Saves the created object to our database
  return newUser
    .save()
    .then((user, error) => {
      // User registration failed
      if (error) {
        return { error: error };

        // User registration successful
      } else {
        return { message: "Registered Successfully" };
      }
    })
    .catch((err) => err);
};

//[SECTION] User authentication

module.exports.loginUser = (req, res) => {
  User.findOne({ email: req.body.email })
    .then((result) => {
      console.log(result);

      // User does not exist
      if (result == null) {
        return res.send({ error: "No Email Found" });

        // User exists
      } else {
        const isPasswordCorrect = bcrypt.compareSync(
          req.body.password,
          result.password
        );
        // If the passwords match/result of the above code is true
        if (isPasswordCorrect) {
          return res.send({ access: auth.createAccessToken(result) });

          // Passwords do not match
        } else {
          return res.send({ error: "Password does not match" });
        }
      }
    })
    .catch((err) => res.send(err));
};

//[SECTION] Retrieve user details

module.exports.getProfile = (req, res) => {
  return User.findById(req.user.id)
    .then((result) => {
      result.password = "";
      return res.send(result);
    })
    .catch((err) => res.send(err));
};

//[SECTION] Enroll a registered User

module.exports.enroll = async (req, res) => {
  console.log(req.user.id); //the user's id from the decoded token after verify()
  console.log(req.body.courseId); //the course from our request body

  //process stops here and sends response IF user is an admin
  if (req.user.isAdmin) {
    return res.send("Action Forbidden");
  }

  let isUserUpdated = await User.findById(req.user.id).then((user) => {
    let newEnrollment = {
      courseId: req.body.courseId,
      courseName: req.body.courseName,
      courseDescription: req.body.courseDescription,
      coursePrice: req.body.coursePrice,
    };
    user.enrollments.push(newEnrollment);

    return user
      .save()
      .then((user) => true)
      .catch((err) => err.message);
  });

  if (isUserUpdated !== true) {
    return res.send({ message: isUserUpdated });
  }

  let isCourseUpdated = await Course.findById(req.body.courseId).then(
    (course) => {
      let enrollee = {
        userId: req.user.id,
      };

      course.enrollees.push(enrollee);

      return course
        .save()
        .then((course) => true)
        .catch((err) => err.message);
    }
  );

  if (isCourseUpdated !== true) {
    return res.send({ message: isCourseUpdated });
  }

  if (isUserUpdated && isCourseUpdated) {
    return res.send({ message: "Enrolled Successfully." });
  }
};

//[ACTIVITY] Getting user's enrolled courses
module.exports.getEnrollments = (req, res) => {
  User.findById(req.user.id)
    .then((result) => res.send(result.enrollments))
    .catch((err) => res.send(err));
};

//ChatGPT Generated

//[SECTION] Reset Password

module.exports.resetPassword = async (req, res) => {
  try {
    //console.log(req.user)
    //console.log(req.body)

    const { newPassword } = req.body;
    const { id } = req.user; // Extracting user ID from the authorization header

    // Hashing the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Updating the user's password in the database
    await User.findByIdAndUpdate(id, { password: hashedPassword });

    // Sending a success response
    res.status(200).send({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
};

//[SECTION] Reset Profile
module.exports.updateProfile = async (req, res) => {
  try {
    console.log(req.user);
    console.log(req.body);

    // Get the user ID from the authenticated token
    const userId = req.user.id;

    // Retrieve the updated profile information from the request body
    const { firstName, lastName, mobileNo } = req.body;

    // Update the user's profile in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, mobileNo },
      { new: true }
    );

    res.send(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to update profile" });
  }
};

//[ACTIVITY] Update Enrollment Status
module.exports.updateEnrollmentStatus = async (req, res) => {
  try {
    const { userId, courseId, status } = req.body;

    // Find the user and update the enrollment status
    const user = await User.findById(userId);

    // Find the enrollment for the course in the user's enrollments array
    const enrollment = user.enrollments.find(
      (enrollment) => enrollment.courseId === courseId
    );

    if (!enrollment) {
      return res.status(404).json({ error: "Enrollment not found" });
    }

    enrollment.status = status;

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: "Enrollment status updated successfully" });
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while updating the enrollment status",
    });
  }
};

//[ACTIVITY] Update user as admin controller
exports.updateUserAsAdmin = async (req, res) => {
  try {
    const { userId } = req.body;

    // Find the user and update isAdmin flag
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.isAdmin = true;

    // Save the updated user document
    await user.save();

    res.status(200).json({ message: "User updated as admin successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while updating the user as admin" });
  }
};