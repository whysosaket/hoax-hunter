// Using enviroment variables to save data from being published online
require("dotenv").config();

const expess = require("express");
const router = expess.Router();

// importinhg the fetchuser middleware
const fetchuser = require("../middleware/fetchuser");

// Importing the User model
const User = require("../models/User");

router.route("/login").post(fetchuser, async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check if the user entered email and password
    if (!email || !password) {
      return res.status(400).send({ error: "Please enter all fields!" });
    }

    // Check if the user with this email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ error: "Invalid Credentials!" });
    }

    // Check if the password is correct
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      return res.status(400).send({ error: "Invalid Credentials!" });
    }

    // If the user is valid, create a token and send it to the user
    const data = {
      user: {
        id: user.id,
      },
    };

    const authtoken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({ success, authtoken });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error!");
  }
});

module.exports = router;
