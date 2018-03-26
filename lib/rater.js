const moduleRecommendation = require('../models/recommendations');
const tools = require('underscore');

class Rater {
    constructor(engine, kind) {
        this.engine = engine;
        this.kind = kind;
        this.db = moduleRecommendation[kind]; //'Views'
    }

    add(user, news) {
        console.log('Action called (add)');
        const params = {};

        params.userId = user._id;
        params.newsId = news._id;
        let newAction = new this.db(params);

        return newAction.save((err) => {
            if (err) return console.log(err);
            this.engine.similars.update(user);
            this.engine.suggestions.update(user);
            return console.log('Action complete (add)');
        });
    }

    remove(user, news) {
        console.log('Action called (remove)');
        return this.db.findOneAndRemove({userId: user._id, newsId: news._id}, (err) => {
            if (err) return console.log(err);
            this.engine.similars.update(user);
            this.engine.suggestions.update(user);
            return console.log('Action complete (remove)');
        });
    }

    itemsByUser(user) {
        return new Promise((resolve, reject) => {
            this.db.findOne({userId: user._id}, (err, doc) => {
                if (err) reject(err);
                console.log('inside itemsByUser ', doc);
                resolve(tools.pluck(doc, 'itemId'))
            })
        });
    }

    usersByItem(item) {
        return new Promise((resolve, reject) => {
            this.db.findOne({itemId: item._id}, (err, doc) => {
                if (err) reject(err);
                console.log('inside usersByItem ', doc);
                resolve(tools.pluck(doc, 'userId'))
            })
        });
    }
}

module.exports = {
    Rater
};