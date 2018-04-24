const moduleRecommendation = require('../models/recommendations');
const tools = require('underscore');
const Promise = require('bluebird');

class Suggestions {
    constructor(engine) {
        this.engine = engine;
        this.db = moduleRecommendation.Suggestions;
    }

    forUser(userId) {
        //console.log('Suggestions: forUser');
        return new Promise((resolve, reject) => {
            this.db.findOne({userId: userId}, (err, {suggestions} = {suggestions: []}) => {
                if (err) reject(err);
                //console.log('inside suggestions, suggestions is ', doc);
                resolve(suggestions)
            })
        })
    }

    update(userId) {
        console.log('Suggestions: update');
        let userViews;
        let userIgnored;
        let others;

        return this.engine.similars.byUser(userId).then(otherUsers => {
            others = otherUsers;
            return Promise.all([
                this.engine.views.itemsByUser(userId),
                this.engine.ignored.itemsByUser(userId)
            ])
        }).then(([views, ignored]) => {
            userViews = views;
            userIgnored = ignored;
            //console.log('userPrefNewsIds for: [ [ views ], [ ignored ] ]');
            //console.log('userPrefNewsIds for:', userPrefNewsIds);

            return Promise.map(others, other => new Promise((resolve, reject) => {
                Promise.all([
                    this.engine.views.itemsByUser(other.userId),
                    this.engine.ignored.itemsByUser(other.userId)
                ]).then(res => {
                    //console.log('newsIds:', res);
                    resolve(res);
                })
            }))
        }).then(news => {
            // all read news from other similar users, except self views and ignores
            const unreadNews = tools.difference(tools.unique(tools.flatten([news])), userViews, userIgnored);
            // no need to delete previous user recommendation, as it will auto replace
            console.log('unreadNews:', unreadNews);
            const suggestion = unreadNews.map(newsId => {
                return Promise.all([
                    this.engine.views.usersByItem(newsId),
                    this.engine.ignored.usersByItem(newsId)
                ]).then(([viewers, ignorers]) => {
                    let currentUserId, numerator = 0;
                    if (typeof userId === 'object')  // noinspection JSUnresolvedFunction
                        currentUserId = userId.toHexString();
                    else
                        currentUserId = userId;
                    //const flattArr = tools.flatten([viewers, ignorers]);
                    //const withoutArr = tools.without(flattArr, currentUserId);
                    //console.log("Suggestions: flattArr:", flattArr);
                    //console.log("Suggestions: without:", withoutArr);
                    const otherUsers = tools.without(tools.flatten([viewers, ignorers]), currentUserId);
                    for (let i = 0; i < otherUsers.length; i++) {
                        let other = otherUsers[i];
                        other = //tools.findWhere(others, 'userId',other);
                            tools.find(others, function (user) {
                                // noinspection JSUnresolvedFunction
                                return ((typeof user.userId === 'object') ?
                                    user.userId.toHexString() : user.userId) === other;
                            });
                        if (other != null)
                            numerator += other.similarity;
                    }
                    const weight = numerator / tools.unique(viewers, ignorers).length;
                    console.log('single news suggestion for id:', newsId, weight);
                    return new Promise((resolve, reject) => {
                        resolve({newsId: newsId, weight});
                    });
                })
            });
            return Promise.all(suggestion);
        }).then(suggestedNews => {
            //console.log('suggestedNews: ', suggestedNews);
            // noinspection SpellCheckingInspection
            return this.db.findOneAndUpdate(
                {userId: userId},
                {suggestions: suggestedNews},
                {upsert: true})
                .exec();
        }).then(() =>
            console.log('Suggestions: update - DONE')
        ).catch(err =>
            console.error(err)
        )
    }
}

module.exports = {
    Suggestions
};