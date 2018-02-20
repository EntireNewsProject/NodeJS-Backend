//This file defines the database schema(layout) and defines a model by the name News based on the newsSchema layout
//this model can be used to write data to the database
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newsSchema = new Schema({
    title: {type: String, required: [true, 'Must specify a title'], trim: true},
    source: {type: String, required: [true, 'Must specify a source'], trim: true},
    cover: {type: String, required: [true, 'Must have a cover image']},
    article: {type: String, required: [true, 'Must have an article'], trim: true},
    subtitle: {type: String, trim: true},
    summary: {type: String, trim: true},
    slug: {
        type: String,
        lowercase: true,
        trim: true,
        required: [true, 'Must specify a slug'],
        index: true,
        unique: true
    },
    url: {type: String, required: [true, 'Must specify a url']},
    saves: {type: Number, default: 0},
    views: {type: Number, default: 0},
    date: {type: String, trim: true},
    published: {type: Boolean, default: false},
    deleted: {type: Boolean, default: false},
    hidden: {type: Boolean, default: false},
    keywords: [{type: String}],
    tags: [{type: String}]
}, {timestamps: true});

module.exports = {
    News: mongoose.model('News', newsSchema)
};
