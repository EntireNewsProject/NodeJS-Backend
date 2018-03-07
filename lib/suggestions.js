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

        this.engine.similars.byUser(user)
            .then(otherUsers => {
                others = otherUsers;
                return Promise.all([
                    this.engine.views.itemsByUser(user),
                    this.engine.ignored.itemsByUser(user)
                ])
            })
            .then(userPref => {
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
            })
            .then(news => {
                const unratedNews = tools.difference(tools.unique(tools.flatten([news])), userViews, userIgnored)
                // TODO delete user
                const suggestion = unratedNews.map(article => {

                });
                return Promise.all(suggestion);
            })
            .then(suggestedDoc => {
                console.log('suggestedDoc: ', suggestedDoc);
                let newAction = new this.db({
                    userId: user._id, suggestions: suggestedDoc
                });
                return newAction.save();
            })
            .then(res => {
                console.log(res);
            })
            .catch(err => {
                console.error(err);
            })
    }
}

module.exports = {
    Suggestions
};