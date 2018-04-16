const moduleRecommendation = require('../models/recommendations');
const tools = require('underscore');

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

        this.engine.similars.byUser(userId).then(otherUsers => {
            others = otherUsers;
            return Promise.all([
                this.engine.views.itemsByUser(userId),
                this.engine.ignored.itemsByUser(userId)
            ])
        }).then(userPref => {
            userViews = userPref[0];
            userIgnored = userPref[1];
            console.log('userPref for: ', userPref);

            return new Promise((resolve, reject) => {
                others.forEach(other => {
                    Promise.all([
                        this.engine.views.itemsByUser(other.userId),
                        this.engine.ignored.itemsByUser(other.userId)
                    ]).then(res => {
                        newsIds.push(res);
                        resolve(newsIds);
                    })
                });
            })
        }).then(news => {
            const unratedNews = tools.difference(tools.unique(tools.flatten([news])), userViews, userIgnored);
            // TODO delete user // no need, it will auto replace
            const suggestion = unratedNews.map(newsId => {
                return Promise.all([
                    this.engine.views.usersByItem(newsId),
                    this.engine.ignored.usersByItem(newsId)
                ])
                    .then(usersByNews => {
                        const viewers = usersByNews[0];
                        const ignorers = usersByNews[1];
                        let numerator = 0;
                        const ref = tools.without(tools.flatten([viewers, ignorers]), userId);
                        for (let i = 0; i < ref.length; i++) {
                            let other = ref[i];
                            other = tools.findWhere(others, {userId: other});
                            if (other != null)
                                numerator += other.similarity;
                        }
                        const weight = numerator / tools.unique(viewers, ignorers).length;
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