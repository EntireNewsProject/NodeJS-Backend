const _ = require('underscore');
const moduleRecommendation = require('../models/recommendations');

class Similars {
    constructor(engine) {
        this.engine = engine;
        this.db = moduleRecommendation.Similars;
    }

    byUser(user, done) {
        this.db.findOne({userId: user._id})
            .exec()
            .then(({doc}) => {
                console.log('inside similar, others is ', doc);
                done(null, doc)
            })
            .catch(err => done(err))
    }

    update(user) {
        return Promise.all([
            this.engine.views.itemsByUser(user),
            this.engine.ignored.itemsByUser(user)
        ])
            .then(userPref => {
                const {userLikes, userDislikes} = userPref;
                const items = _.flatten([userLikes, userDislikes]);
                const raters = [this.engine.views, this.engine.ignored];
                const othersArr = items.map((item) => {
                    return raters.map((rater) => {
                        return rater.usersByItem(item);
                    });
                });
                return Promise.all(_.flatten(othersArr))
            })
            .then(otherArr => {
                const otherUsers = _.without(_.unique(_.flatten(otherArr)), user);
                // TODO ...
            })
    }
}

module.exports = {
    Similars
};
