const moduleRecommendation = require('../models/recommendations');
const tools = require('underscore');

class Similars {
    constructor(engine) {
        this.engine = engine;
        this.db = moduleRecommendation.Similars;
    }

    byUser(user) {
        return new Promise((resolve, reject) => {
            this.db.findOne({userId: user._id}, (err, {doc}) => {
                if (err) reject(err);
                console.log('inside similar, others is ', doc);
                resolve(doc)
            })
        })
    }

    update(user) {
        return Promise.all([
            this.engine.views.itemsByUser(user),
            this.engine.ignored.itemsByUser(user)
        ])
            .then(userPref => {
                const {userLikes, userDislikes} = userPref;
                const items = tools.flatten([userLikes, userDislikes]);
                const raters = [this.engine.views, this.engine.ignored];
                const othersArr = items.map((item) => {
                    return raters.map((rater) => {
                        return rater.usersByItem(item);
                    });
                });
                return Promise.all(tools.flatten(othersArr))
            })
            .then(otherArr => {
                const otherUsers = tools.without(tools.unique(tools.flatten(otherArr)), user);
                // TODO ...
            })
    }
}

module.exports = {
    Similars
};
