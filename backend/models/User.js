const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    score: {type: Number, default: 0},
    frequency: {type: Number, default: 0},
    date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('user', userSchema);