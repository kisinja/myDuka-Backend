const router = require("express").Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

//REGISTER
router.post("/register", async (req, res) => {
  const newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
    console.log(err.message);
  }
});

//LOGIN

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(400).json("Wrong credentials");
    } else {
      const validPassword = bcrypt.compareSync(req.body.password, user.password);
      if (!validPassword) {
        return res.status(400).json("Wrong credentials");
      } else {
        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, "elvis", { expiresIn: "3d" });

        const { password, ...others } = user._doc;
        return res.json({ "token": token, "user": others }).status(200);
      }
    }
  } catch (error) {
    console.error(error.message);
    return res.status(500).send(error.message);
  }
})

module.exports = router;
