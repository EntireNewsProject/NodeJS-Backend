const moduleRecommendation = require('../models/recommendations');
const tools = require('underscore');
const Promise = require('bluebird');

class Similars {
    constructor(engine) {
        this.engine = engine;
        this.db = moduleRecommendation['Similars'];
    }

    byUser(userId) {
        //console.log('Similars: byUser');
        return new Promise((resolve, reject) => {
            moduleRecommendation.Similars.findOne({userId: userId}, (err, doc) => {
                if (err) reject(err);
                if (doc) {
                    //console.log('inside similar, others is ', doc.others);
                    resolve(doc.others);
                } else {
                    console.error('Similars: No others');
                    resolve([])
                }
            })
        })
    }

    update(userId) {
        console.log('Similars: update');
        let userViews;
        let userIgnored;
        return Promise.all([
            this.engine.views.itemsByUser(userId),
            this.engine.ignored.itemsByUser(userId)
        ]).then(([views, ignored]) => {
            userViews = views;
            userIgnored = ignored;
            const flattArr = tools.flatten([userViews, userIgnored]);
            const raters = [this.engine.views, this.engine.ignored];
            const promiseOthersArr = flattArr.map(article => {
                return raters.map(rater => {
                    // find other users who viewed articles that are viewed by current user
                    return rater.usersByItem(article);
                });
            });
            // return the flattened version of other users
            return Promise.all(tools.flatten(promiseOthersArr));
        }).then(othersArr => {
            let currentUserId;
            if (typeof userId === 'object')// noinspection JSUnresolvedFunction
                currentUserId = userId.toHexString();
            else
                currentUserId = userId;
            // find unique users who viewed same articles (without gets rid of self)
            const otherUsers = tools.without(tools.unique(tools.flatten(othersArr)), currentUserId);
            return Promise.map(otherUsers, otherUser => new Promise((resolve, reject) => {
                Promise.all([
                    this.engine.views.itemsByUser(otherUser),
                    this.engine.ignored.itemsByUser(otherUser)
                ]).then(([otherLikes, otherDislikes]) => {
                    // calculate similarity
                    const similarity =
                        (
                            tools.intersection(userViews, otherLikes).length +
                            tools.intersection(userIgnored, otherDislikes).length -
                            tools.intersection(userViews, otherDislikes).length -
                            tools.intersection(userIgnored, otherLikes).length
                        ) / tools.union(userViews, otherLikes, userIgnored, otherDislikes).length;
                    resolve({userId: otherUser, similarity});
                })
            }))
        }).then(othersArr => {
            console.log('Others:', othersArr);
            // noinspection SpellCheckingInspection
            return this.db.findOneAndUpdate(
                {userId: userId},
                {others: othersArr},
                {upsert: true})
                .exec();
        }).then(() =>
            console.log('Similars: update - DONE')
        ).catch(err =>
            console.error(err.message)
        )
    }
}

module.exports = {
    Similars
};
