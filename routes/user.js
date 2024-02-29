const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../Db");

// User Routes
router.post("/signup", (req, res) => {
  // Implement user signup logic
  const username = req.body.username;
  const password = req.body.password;
  User.create({
    username: username,
    password: password,
  })
    .then((result) => {
      res.status(200).json({ msg: "User created successfully" });
    })
    .catch((err) => {
      res
        .status(403)
        .json({ msg: "There was an error while creating the user" });
    });
});

router.get("/courses", async (req, res) => {
  // Implement listing all courses logic
  const courses = await Course.find();
  res.status(200).json({ courses: courses });
});

router.post("/courses/:courseId", userMiddleware, (req, res) => {
  // Implement course purchase logic
  const courseId = req.params.courseId;
  const username = req.headers.username;
  User.updateOne(
    { username: username },
    { $push: { purchasedCourses: courseId } }
  )
    .then(() => {
      res.json({ msg: "Course added successfully" });
    })
    .catch((err) => {
      res.status(500).json({ msg: "Internal Server Error" });
    });
});

router.get("/purchasedCourses", userMiddleware, async (req, res) => {
  // Implement fetching purchased courses logic
  const username = req.headers.username;
  const user = await User.findOne({ username: username });
  const coursesPurchased = user.purchasedCourses;
  const courses = await Course.find({ _id: { $in: coursesPurchased } });
  res.json({ msg: courses });
});

module.exports = router;
