//This file defines the database schema(layout) and defines a model by the name News based on the newsSchema layout
//this model can be used to write data to the database
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt-nodejs');

const userSchema = new Schema({
    username: {type: String, required: true, trim: true, unique: true},
    email: {type: String, required: true, trim: true, unique: true},
    password: {type: String, required: true},
    type: {type: Number, default: 0},
    fullName: {type: String, trim: true},
    profilePic: {type: String},
    active: {type: Boolean, default: false}
}, {timestamps: true});

userSchema.pre('save', function (next) {
    // because this will not be accessible from inside if nested callback
    const user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(100, function (err, salt) {
            if (err) return next(err);
            bcrypt.hash(user.password, salt, null, function (err, hash) {
                if (err) return next(err);
                user.password = hash;
                next();
            })
        })
    } else return next();
});

userSchema.methods.comparePassword = function (password, cb) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
        if (err) return cb(err);
        return cb(null, isMatch);
    })
};

userSchema.plugin(uniqueValidator);

module.exports = {
    User: mongoose.model('User', userSchema)
};