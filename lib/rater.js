const moduleRecommendation = require('../models/recommendations');
const tools = require('underscore');
const toStr = require('../config/tools').toStr;

class Rater {
    constructor(engine, kind) {
        this.engine = engine;
        this.kind = kind;
        this.db = moduleRecommendation[kind]; //'Views'
    }

    add(userId, newsId, update) {
        console.log('Action called (add)', this.kind);
        // noinspection SpellCheckingInspection
        return this.db.findOneAndUpdate(
            {userId: userId, newsId: newsId},
            {},
            {upsert: true},
            (err, doc) => {
                if (err) return console.error(err);
                //console.log('Action complete (add), now update similars & suggestions');
                // Returns null after inserting the new document
                if (!doc && update)
                    return this.engine.similars.update(userId)
                        .then(() => this.engine.suggestions.update(userId))
                        .catch(err => console.error(err));
                //return console.log('All action done (add)');
                return null;
            });
    }

    remove(userId, newsId, update) {
        console.log('Action called (remove)', this.kind);
        return this.db.findOneAndRemove({userId: userId, newsId: newsId}, (err) => {
            if (err) return console.log(err);
            //console.log('Action complete (remove), now update similars & suggestions');
            if (update)
                return this.engine.similars.update(userId)
                    .then(() => this.engine.suggestions.update(userId))
                    .catch(err => console.error(err));
            return null;
            //return console.log('All action done (remove)');
        });
    }

    itemsByUser(userId) {
        //console.log('itemsByUser called', this.kind);
        return new Promise((resolve, reject) => {
            this.db.find({userId: userId}, (err, doc) => {
                if (err) reject(err);
                //console.log('inside itemsByUser (' + this.kind + '),', doc);
                let ids = tools.pluck(doc, 'newsId');
                ids = toStr(ids);
                resolve(ids);
            })
        });
    }

    usersByItem(newsId) {
        //console.log('usersByItem called', this.kind);
        return new Promise((resolve, reject) => {
            this.db.find({newsId: newsId}, (err, doc) => {
                if (err) reject(err);
                //console.log('inside usersByItem (' + this.kind + '),', doc);
                let ids = tools.pluck(doc, 'userId');
                ids = toStr(ids);
                resolve(ids);
            })
        });
    }
}

module.exports = {
    Rater
};