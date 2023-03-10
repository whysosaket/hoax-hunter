const mongoose = require('mongoose');


const commentSchema = new mongoose.Schema({
    info: {type: String, required: true},
    link: {type: String, required: true},
    upvotes: {type: Number, default: 0},
    downvotes: {type: Number, default: 0},
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    classified: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'classified'
    },
    date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('comment', commentSchema);