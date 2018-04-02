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
        console.log('itemsByUser called', this.kind);
        return new Promise((resolve, reject) => {
            this.db.find({userId: user._id}, (err, doc) => {
                if (err) reject(err);
                console.log('inside itemsByUser (' + this.kind + '),', doc);
                resolve(tools.pluck(doc, 'newsId'));
            })
        });
    }

    usersByItem(item) {
        //console.log(20);
        //console.log(item);
        console.log('usersByItem called', this.kind);
        return new Promise((resolve, reject) => {
            this.db.find({itemId: item._id}, (err, doc) => {
                if (err) reject(err);
                console.log('inside usersByItem (' + this.kind + '),', doc);
                resolve(tools.pluck(doc, 'userId'))
            })
        });
    }
}

module.exports = {
    Rater
};