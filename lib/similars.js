const moduleRecommendation = require('../models/recommendations');
const _ = require('underscore');
const tools = require('../config/tools');
Promise = require('bluebird');

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
                if (doc) {
                    console.log('inside similar, others is ', doc.others);
                    resolve(doc.others);
                } else {
                    console.error('No others 01');
                    resolve([])
                }
            })
        })
    }

    update(userId) {
        console.log('Similars: update');
        let userViews;
        let userIgnored;
        let news;
        return Promise.all([
            this.engine.views.itemsByUser(userId),
            this.engine.ignored.itemsByUser(userId)
        ]).then(userPrefNewsIds => {
            console.log('userPrefNewsIds for: [ [ views ], [ ignored ] ]');
            console.log('userPrefNewsIds for:', userPrefNewsIds);
            userViews = userPrefNewsIds[0];
            userIgnored = userPrefNewsIds[1];

            news = _.flatten([userViews, userIgnored]);
            console.log('Flattened:', news);

            const raters = [this.engine.views, this.engine.ignored];
            const promiseOtherArr = news.map(article => {
                return raters.map(rater => {
                    return rater.usersByItem(article);
                });
            });
            return Promise.all(_.flatten(promiseOtherArr));
        }).then(othersArr => {
            const flattArr = _.flatten(othersArr);
            const uniqueArr = _.unique(flattArr);
            const withoutArr = _.without(uniqueArr, userId.toHexString());
            console.log("Similars: flatten:", flattArr);
            console.log("Similars: unique:", uniqueArr);
            console.log("Similars: without:", withoutArr);
            const otherUsers = withoutArr;

            return Promise.map(otherUsers, otherUser => new Promise((resolve, reject) => {
                Promise.all([
                    this.engine.views.itemsByUser(otherUser),
                    this.engine.ignored.itemsByUser(otherUser)
                ]).then(otherPref => {
                    const otherLikes = otherPref[0];
                    const otherDislikes = otherPref[1];
                    const similarity =
                        (
                            _.intersection(userViews, otherLikes).length +
                            _.intersection(userIgnored, otherDislikes).length -
                            _.intersection(userViews, otherDislikes).length -
                            _.intersection(userIgnored, otherLikes).length
                        ) / _.union(userViews, otherLikes, userIgnored, otherDislikes).length;
                    resolve({userId: otherUser, similarity});
                    //others.push({userId: otherUser, similarity});
                })
            }))

        }).then(othersDoc => {
            //console.log('OthersDoc--:', others);
            console.log('OthersDoc:', othersDoc);
            // noinspection JSCheckFunctionSignatures
            return this.db.findOneAndUpdate(
                {userId: userId},
                {others: othersDoc},
                {upsert: true}).exec();
        }).then(() => {
            console.log('Similars: update - DONE');
        }).catch(err => {
            console.error(err.message);
        })
    }
}

module.exports = {
    Similars
};
