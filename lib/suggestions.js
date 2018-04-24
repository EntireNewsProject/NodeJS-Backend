const moduleRecommendation = require('../models/recommendations');
const _ = require('underscore');
const tools = require('../config/tools');

class Suggestions {
    constructor(engine) {
        this.engine = engine;
        this.db = moduleRecommendation.Suggestions;
    }

    forUser(userId) {
        console.log('Suggestions: forUser');
        return new Promise((resolve, reject) => {
            this.db.findOne({userId: userId}, (err, {doc = {suggestions: []}}) => {
                if (err) reject(err);
                console.log('inside suggestions, suggestions is ', doc);
                resolve(doc)
            })
        })
    }

    update(userId) {
        console.log('Suggestions: update');
        let userViews;
        let userIgnored;
        let others;
        let newsIds = [];

        this.engine.similars.byUser(userId)
            .then(otherUsers => {
                others = otherUsers;
                return Promise.all([
                    this.engine.views.itemsByUser(userId),
                    this.engine.ignored.itemsByUser(userId)
                ])
            })
            .then(userPrefNewsIds => {
                userViews = userPrefNewsIds[0];
                userIgnored = userPrefNewsIds[1];
                console.log('userPrefNewsIds for: [ [ views ], [ ignored ] ]');
                console.log('userPrefNewsIds for:', userPrefNewsIds);

                return Promise.map(others, other => new Promise((resolve, reject) => {
                    Promise.all([
                        this.engine.views.itemsByUser(other.userId),
                        this.engine.ignored.itemsByUser(other.userId)
                    ]).then(res => {
                        console.log('newsIds:', res);
                        resolve(res);
                    })
                }))
            })
            .then(news => {
                console.log('ssss:', news);
                const unreadNews = _.difference(_.unique(_.flatten([news])), userViews, userIgnored);
                // TODO delete user // no need, it will auto replace
                console.log('unreadNews:', unreadNews);
                const suggestion = unreadNews.map(newsId => {
                    return Promise.all([
                        this.engine.views.usersByItem(newsId),
                        this.engine.ignored.usersByItem(newsId)
                    ]).then(usersByNews => {
                        const viewers = usersByNews[0];
                        const ignorers = usersByNews[1];
                        let numerator = 0;

                        const flattArr = _.flatten([viewers, ignorers]);
                        const withoutArr = _.without(flattArr, userId.toHexString());
                        console.log("Suggestions: flattArr:", flattArr);
                        console.log("Suggestions: without:", withoutArr);
                        const ref = withoutArr;
                        for (let i = 0; i < ref.length; i++) {
                            let other = ref[i];
                            other = _.findWhere(others, {userId: other});
                            if (other != null)
                                numerator += other.similarity;
                        }
                        const weight = numerator / _.unique(viewers, ignorers).length;
                        console.log('single suggestion is ', newsId, weight);
                        return new Promise((resolve, reject) => {
                            resolve({newsId: newsId, weight});
                        });
                    })
                });
                return Promise.all(suggestion);
            }).then(suggestedDoc => {
            console.log('suggestedDoc: ', suggestedDoc);
            // noinspection JSCheckFunctionSignatures
            return this.db.findOneAndUpdate(
                {userId: userId},
                {suggestions: suggestedDoc},
                {upsert: true}).exec();
        }).then(res => {
            console.log('response ', res);
        }).catch(err => {
            console.error(err);
        })
    }
}

module.exports = {
    Suggestions
};