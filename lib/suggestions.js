const moduleRecommendation = require('../models/recommendations');
const tools = require('underscore');

class Suggestions {
    constructor(engine) {
        this.engine = engine;
        this.db = moduleRecommendation.Suggestions;
    }

    forUser(user) {
        return new Promise((resolve, reject) => {
            this.db.findOne({userId: user._id}, (err, {doc = {suggestions: []}}) => {
                if (err) reject(err);
                console.log('inside suggestions, suggestions is ', doc);
                resolve(doc)
            })
        })
    }

    update(user) {
        let userViews;
        let userIgnored;
        let others;
        let news = [];

        this.engine.similars.byUser(user).then(otherUsers => {
            others = otherUsers;
            return Promise.all([
                this.engine.views.itemsByUser(user),
                this.engine.ignored.itemsByUser(user)
            ])
        }).then(userPref => {
            userViews = userPref[0];
            userIgnored = userPref[1];
            console.log('userPref for: ', userPref);

            return new Promise((resolve, reject) => {
                others.forEach(other => {
                    Promise.all([
                        this.engine.views.itemsByUser(other.user),
                        this.engine.ignored.itemsByUser(other.user)
                    ]).then(res => {
                        news.push(res);
                        resolve(news);
                    })
                });
            })
        }).then(news => {
            const unratedNews = tools.difference(tools.unique(tools.flatten([news])), userViews, userIgnored);
            // TODO delete user // no need, it will auto replace
            const suggestion = unratedNews.map(article => {
                return Promise.all([
                    this.engine.views.usersByItem(article),
                    this.engine.ignored.usersByItem(article)
                ])
                    .then(usersByNews => {
                        const viewers = usersByNews[0];
                        const dismissers = usersByNews[1];
                        let numerator = 0;
                        const ref = tools.without(tools.flatten([viewers, dismissers]), user._id);
                        for (let i = 0; i < ref.length; i++) {
                            let other = ref[i];
                            other = tools.findWhere(others, {user: other});
                            if (other != null)
                                numerator += other.similarity;
                        }
                        const weight = numerator / tools.unique(viewers, dismissers).length;
                        console.log('single suggestion is ', article.title, weight);
                        return new Promise((resolve, reject) => {
                            resolve({article, weight});
                        });
                    })
            });
            return Promise.all(suggestion);
        }).then(suggestedDoc => {
            console.log('suggestedDoc: ', suggestedDoc);
            // noinspection JSCheckFunctionSignatures
            return this.db.findByIdAndUpdate(
                user._id,
                {suggestions: suggestedDoc},
                {upsert: true}).exec();
        }).then(res => {
            console.log(res);
        }).catch(err => {
            console.error(err);
        })
    }
}

module.exports = {
    Suggestions
};