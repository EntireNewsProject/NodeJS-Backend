//This file defines the database schema(layout) and defines a model by the name News based on the newsSchema layout
//this model can be used to write data to the database
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: {type: String, required: true, trim: true},
    email: {type: String, required: true, trim: true},
    password: {type: String, required: true},
    type: {type: Number, default: 0},
    fullName: {type: String, trim: true},
    active: {type: Boolean, default: false}
}, {timestamps: true});

module.exports = {
    User: mongoose.model('User', userSchema)
};