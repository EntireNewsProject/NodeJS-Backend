const moduleRecommendation = require('../models/recommendations');
const tools = require('underscore');

class Rater {
    constructor(engine, kind) {
        this.engine = engine;
        this.kind = kind;
        this.db = moduleRecommendation[kind]; //'Views'
    }

    add(user, news) {
        console.log('Action called (add)', this.kind);
        return this.db.findOneAndUpdate(
            {userId: user._id, newsId: news._id},
            {},
            {upsert: true},
            (err) => {
                if (err) return console.error(err);
                console.log('Action complete (add), now update similars & suggestions');
                this.engine.similars.update(user);
                this.engine.suggestions.update(user);
                return console.log('All action done (add)');
            });
    }

    remove(user, news) {
        console.log('Action called (remove)');
        return this.db.findOneAndRemove({userId: user._id, newsId: news._id}, (err) => {
            if (err) return console.log(err);
            console.log('Action complete (remove), now update similars & suggestions');
            this.engine.similars.update(user);
            this.engine.suggestions.update(user);
            return console.log('All action done (remove)');
        });
    }

    itemsByUser(user) {
        return new Promise((resolve, reject) => {
            this.db.findOne({userId: user._id}, (err, doc) => {
                if (err) reject(err);
                console.log('inside itemsByUser,', doc);
                if (doc) resolve(tools.pluck(doc, 'newsId'));
                else reject(new Error('Noo others'))
            })
        });
    }

    usersByItem(item) {
        //console.log(20);
        //console.log(item);
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