var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var newsSchema = new newsSchema({
    title: String,
    datetime:   { type: Date, default: Date.now },
    source: String,
    cover: String,
    article: String,
    slug: String,
    saves: Number,
    views: Number,
    published: Boolean,
    deleted: Boolean,
    meta: {
        votes: Number,
        favs:  Number
    },
    hidden: Boolean
});

module.exports = {
    News: mongoose.model('News', newsSchema),
};