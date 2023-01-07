// Using enviroment variables to save data from being published online
require("dotenv").config();

const expess = require("express");
const router = expess.Router();

// importing News model
const News = require("../models/News");

// importing Classified model
const Classified = require("../models/Classified");

router.route("/addnews").post(async (req, res) => {
  try {
    const { info, username } = req.body;

    if (!info) {
      return res.status(400).send({ error: "Some Error!" });
    }

    // Check if the news already exists
    const news = await News.findOne({ info });

    if (news) {
      if (news.isVerified) {
        //  If news is verified, then send is true or false to the user
        const classification = await Classified.findOne({
          _id: news.classification,
        });
        if (classification) {
          success = true;
          res.json({
            success,
            username,
            message: "News already exists!",
            open: classification.open,
            isTrue: classification.isTrue,
            upvotes: classification.upvotes,
            downvotes: classification.downvotes,
          });
        }
      }

      // if news is already classified, then send the classification to the new news id
      if (news.isClassified) {
        const news = await News.create({
          info,
          username,
          isClassified: true,
          classification: news.classification,
        });
      }
      success = true;
      res.json({
        success,
        message: "News added successfully! Waiting for verification",
      });
    } else {
      const news = await News.create({
        info,
        username
      });
      success = true;
      res.json({
        success,
        message: "News added successfully! Waiting for verification",
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error!");
  }
});

// Route 2: Get all the news of a particular classification
router.route("/getnews").get(async (req, res) => {
  try {
    const { classification } = req.body;
    const news = await News.find({ classification });
    success = true;
    res.json({ success, news });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error!");
  }
});


module.exports = router;