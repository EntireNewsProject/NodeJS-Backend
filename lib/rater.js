const moduleRecommendation = require('../models/recommendations');
const _ = require('underscore');
const tools = require('../config/tools');

class Rater {
    constructor(engine, kind) {
        this.engine = engine;
        this.kind = kind;
        this.db = moduleRecommendation[kind]; //'Views'
    }

    add(userId, newsId) {
        console.log('Action called (add)', this.kind);
        return this.db.findOneAndUpdate(
            {userId: userId, newsId: newsId},
            {},
            {upsert: true},
            (err) => {
                if (err) return console.error(err);
                console.log('Action complete (add), now update similars & suggestions');
                this.engine.similars.update(userId);
                this.engine.suggestions.update(userId);
                return console.log('All action done (add)');
            });
    }

    remove(userId, newsId) {
        console.log('Action called (remove)');
        return this.db.findOneAndRemove({userId: userId, newsId: newsId}, (err) => {
            if (err) return console.log(err);
            console.log('Action complete (remove), now update similars & suggestions');
            this.engine.similars.update(user);
            this.engine.suggestions.update(user);
            return console.log('All action done (remove)');
        });
    }

    itemsByUser(userId) {
        console.log('itemsByUser called', this.kind);
        return new Promise((resolve, reject) => {
            this.db.find({userId: userId}, (err, doc) => {
                if (err) reject(err);
                console.log('inside itemsByUser (' + this.kind + '),', doc);
                let id = _.pluck(doc, 'newsId');
                id = tools.str(id);
                resolve(id);
            })
        });
    }

    usersByItem(newsId) {
        console.log('usersByItem called', this.kind);
        return new Promise((resolve, reject) => {
            this.db.find({newsId: newsId}, (err, doc) => {
                if (err) reject(err);
                console.log('inside usersByItem (' + this.kind + '),', doc);
                let id = _.pluck(doc, 'userId');
                id = tools.str(id);
                resolve(id);
            })
        });
    }
}

module.exports = {
    Rater
};