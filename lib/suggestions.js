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
        let news;
        let others = [];

        Promise.all([
            this.engine.views.itemsByUser(user),
            this.engine.ignored.itemsByUser(user)
        ]).then(userPref => {
            userViews = userPref[0];
            userIgnored = userPref[1];
            console.log('userPref for: ', userPref);

            news = tools.flatten([userViews, userIgnored]);
            const raters = [this.engine.views, this.engine.ignored];
            const promiseOtherArr = news.map(article => {
                return raters.map(rater => {
                    return rater.usersByItem(article);
                });
            });
            return Promise.all(tools.flatten(promiseOtherArr));
        }).then(othersArr => {
            const otherUsers = tools.without(tools.unique(tools.flatten(othersArr)), user._id);
            return new Promise((resolve, reject) => {
                otherUsers.forEach(otherUser => {
                    Promise.all([
                        this.engine.views.itemsByUser(otherUser),
                        this.engine.ignored.itemsByUser(otherUser)
                    ]).then(otherPref => {
                        const otherLikes = otherPref[0];
                        const otherDislikes = otherPref[1];
                        const similarity =
                            (
                                tools.intersection(userViews, otherLikes).length +
                                tools.intersection(userIgnored, otherDislikes).length -
                                tools.intersection(userViews, otherDislikes).length -
                                tools.intersection(userIgnored, otherLikes).length
                            ) / tools.union(userViews, otherLikes, userIgnored, otherDislikes).length;
                        others.push({user: otherUser, similarity});
                        resolve(others);
                    })
                })
            });
        }).then(othersDoc => {
            console.log('OthersDoc: ', othersDoc);
            let newAction = new this.db({
                userId: user._id, others: othersDoc
            });
            newAction.save(err => {
                if (err) console.log(err)
            });
        })
    }
}

module.exports = {
    Suggestions
};