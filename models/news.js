//This file defines the database schema(layout) and defines a model by the name News based on the newsSchema layout
//this model can be used to write data to the database
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var newsSchema = new Schema({
    title: {type: String, required: true, trim: true},
    source: String,
    cover: String,
    article: String,
    slug: {type: String, lowercase: true, trim: true, required: true, index: true, unique: true},
    saves: Number,
    views: Number,
    published: Boolean,
    deleted: Boolean,
    meta: {
        votes: Number,
        favs:  Number
    },
    hidden: Boolean
}, {timestamps: true});

module.exports = {
    News: mongoose.model('News', newsSchema)
};