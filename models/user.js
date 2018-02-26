//This file defines the database schema(layout) and defines a model by the name News based on the newsSchema layout
//this model can be used to write data to the database
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const userSchema = new Schema({
    username: {
        type: String,
        lowercase: true,
        trim: true,
        required: [true, 'Must specify a username'],
        unique: true
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        match: /^\S+@\S+\.\S+$/,
        minlength: [9, 'Email can\'t be less than 9 characters'],
        maxlength: [32, 'Email can\'t be more than 32 characters'],
        required: [true, 'Must specify an email'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Must specify a password']
    },
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

userSchema.pre('findOneAndUpdate', function (next) {
    // because this will not be accessible from inside if nested callback
    const updates = this;
    if (updates.getUpdate().$set.password) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) return next(err);
            bcrypt.hash(updates.getUpdate().$set.password, salt, null, function (err, hash) {
                if (err) return next(err);
                updates.getUpdate().$set.password = hash;
                next();
            })
        })
    } else return next();
});

userSchema.post('save', function (error, doc, next) {
    if (error.code === 11000)
        next(new Error('Username or email already in use.'));
    else next(error);
});

userSchema.post('findOneAndUpdate', function (error, doc, next) {
    if (error.code === 11000)
        next(new Error('This username/email is associated with another account, please use a different one.'));
    else next(error);
});

userSchema.methods.comparePassword = function (password, cb) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
        if (err) return cb(err);
        return cb(null, isMatch);
    })
};

userSchema.methods.compareHash = function (password, cb) {
    if (this.password === password) return cb(null);
    return cb(new Error('Login expired. Please login again.'));
};

userSchema.methods.comparePasswordSync = function (password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = {
    User: mongoose.model('User', userSchema)
};