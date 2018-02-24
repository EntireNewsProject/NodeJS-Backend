//This file defines the database schema(layout) and defines a model by the name News based on the newsSchema layout
//this model can be used to write data to the database
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const likeSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    newsId: {type: Schema.Types.ObjectId, ref: 'News', required: true}
}, {_id: false, timestamps: true});

const viewSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    newsId: {type: Schema.Types.ObjectId, ref: 'News', required: true}
}, {_id: false, timestamps: true});

const similarSchema = new Schema(

);

const suggestionSchema = new Schema(

);

// noinspection JSCheckFunctionSignatures
likeSchema.index({
    userId: 1,
    newsId: 1
}, {unique: true});
// noinspection JSCheckFunctionSignatures
viewSchema.index({
    userId: 1,
    newsId: 1
}, {unique: true});

module.exports = {
    Likes: mongoose.model('Likes', likeSchema),
    Views: mongoose.model('Views', viewSchema),
    Similars: mongoose.model('Similars', similarSchema),
    Suggestions: mongoose.model('Suggestions', suggestionSchema)
};