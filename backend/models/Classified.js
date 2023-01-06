const mongoose = require('mongoose');


const classifiedSchema = new mongoose.Schema({
    info: {type: String, required: true},
    open: {type: Boolean, required: true},
    isTrue: {type: Boolean, required: true},
    upvotes: {type: Number, default: 0},
    downvotes: {type: Number, default: 0},
    date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('classified', classifiedSchema);