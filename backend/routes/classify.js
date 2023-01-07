// Using enviroment variables to save data from being published online
require("dotenv").config();

const expess = require("express");
const router = expess.Router();

// importing News model
const News = require("../models/News");

// importing Classified model
const Classified = require("../models/Classified");

// importing Comment model
const Comment = require("../models/Comment");

//importing fetchuser middleware
const fetchuser = require("../middleware/fetchuser");

// Route 0: Get all classified message
router.route('/all')
.get(async (req, res)=>{
    try{
        const all = await Classified.find({}, 'info')
        let success = true;
        res.json({success, all});
    }
    catch(error){
        console.log(error.message);
        res.status(500).send("Internal Server Error!");
    }
})


// Route 1: Vote a Classification
router.route("/vote").post(async (req, res) => {
    try{
        const {classificationId, vote} = req.body;
        const classification = await Classified.findOne({_id: classificationId});
        if(classification){
            if(vote === "upvote"){
                classification.upvotes += 1;
            }else{
                classification.downvotes += 1;
            }
            classification.save();
            success = true;
            res.json({success});
        }else{
            res.status(400).send({error: "Some Error!"});
        }
    }catch(error){
        console.log(error.message);
        res.status(500).send("Internal Server Error!");
    }});

    // Route 2: Add Comment on a Classification
    router.route("/addcomment").post(fetchuser, async (req, res) => {
        const {classificationId, comment, link} = req.body;
        const classification = await Classified.findOne({_id: classificationId});
        if(classification){

            // Check if the comment already exists
            const commentExists = classification.Comments.find((c) => c.comment === comment.comment);
            if(commentExists){
                return res.status(400).send({error: "Comment already exists!"});
            }

            // creating a comment
            const com = await Comment.create({
                info: comment,
                user: req.user.id,
                link,
                classified: classificationId
            });

            classification.Comments.push(com);
            classification.save();
            success = true;
            res.json({success});
        }else{
            res.status(400).send({error: "Some Error!"});
        }
    });

    // Route 3: Get all comments on a classification
    router.route("/getcomments").post(async (req, res) => {
        
        const {classificationId} = req.body;
        const classification = await Classified.findOne({_id: classificationId});
        if(classification){
            const comments = classification.Comments;
            success = true;
            res.json({success, comments});
        }else{
            res.status(400).send({error: "Some Error!"});
        }
    });

  // Route 4: Vote a Comment
    router.route("/votecomment").post(async (req, res) => {

        const {commentId, vote} = req.body;
        const comment = await Comment.findOne({_id: commentId});
        if(comment){
            if(vote === "upvote"){
                comment.upvotes += 1;
            }else{
                comment.downvotes += 1;
            }
            comment.save();
            success = true;
            res.json({success});
        }else{
            res.status(400).send({error: "Some Error!"});
        }
    });
    
    module.exports = router;