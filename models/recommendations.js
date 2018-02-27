//This file defines the database schema(layout) and defines a model by the name News based on the newsSchema layout
//this model can be used to write data to the database
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const viewSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    newsId: {type: Schema.Types.ObjectId, ref: 'News', required: true}
}, {_id: false});

const ignoredSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    newsId: {type: Schema.Types.ObjectId, ref: 'News', required: true}
}, {_id: false});

const similarSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    other: [new Schema({
        userId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
        similarity: {type: Number, required: true},
    }, {_id: false})]
}, {_id: false});

const suggestionSchema = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    suggestions: [new Schema({
        newsId: {type: Schema.Types.ObjectId, ref: 'News', required: true},
        weight: {type: Number, required: true},
    }, {_id: false})]
}, {_id: false});

// noinspection JSCheckFunctionSignatures
viewSchema.index({
    userId: 1,
    newsId: 1
}, {unique: true});

// noinspection JSCheckFunctionSignatures
ignoredSchema.index({
    userId: 1,
    newsId: 1
}, {unique: true});

module.exports = {
    Ignored: mongoose.model('Ignored', ignoredSchema),
    Views: mongoose.model('Views', viewSchema),
    Similars: mongoose.model('Similars', similarSchema),
    Suggestions: mongoose.model('Suggestions', suggestionSchema)
};