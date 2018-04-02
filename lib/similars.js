const moduleRecommendation = require('../models/recommendations');
const tools = require('underscore');

class Similars {
    constructor(engine) {
        this.engine = engine;
        this.db = moduleRecommendation['Similars'];
    }

    byUser(userId) {
        console.log('Similars: byUser');
        return new Promise((resolve, reject) => {
            moduleRecommendation.Similars.findOne({userId: userId}, (err, doc) => {
                if (err) reject(err);
                console.log('inside similar, others is ', doc);
                if (doc) resolve(doc.others);
                else reject(new Error('Noo others02'))
                // else resolve([]);
            })
        })
    }

    update(userId) {
        console.log('Similars: update');
        let userViews;
        let userIgnored;
        let news;
        let others = [];
        return Promise.all([
            this.engine.views.itemsByUser(userId),
            this.engine.ignored.itemsByUser(userId)
        ]).then(userPref => {
            console.log('userPref for: [ [ views ], [ ignored ] ]');
            console.log('userPref for:', userPref);
            userViews = userPref[0];
            userIgnored = userPref[1];

            news = tools.flatten([userViews, userIgnored]);
            const raters = [this.engine.views, this.engine.ignored];
            const promiseOtherArr = news.map(article => {
                return raters.map(rater => {
                    return rater.usersByItem(article);
                });
            });
            return Promise.all(tools.flatten(promiseOtherArr));
        }).then(othersArr => {
            const otherUsers = tools.without(tools.unique(tools.flatten(othersArr)), userId);
            console.log('othersArr',othersArr);
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
                        others.push({userId: otherUser, similarity});
                        resolve(others);
                    })
                })
            });
        }).then(othersDoc => {
            console.log('OthersDoc:', othersDoc);
            // noinspection JSCheckFunctionSignatures
            return this.db.findOneAndUpdate(
                {userId: userId},
                {others: othersDoc},
                {upsert: true}).exec();
        }).then(res => {
            console.log('response', res);
        }).catch(err => {
            console.error(err.message);
        })
    }
}

module.exports = {
    Similars
};
