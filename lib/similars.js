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

    update(user, done) {
        Promise.all([
            this.engine.views.itemsByUser(user),
            this.engine.ignored.itemsByUser(user)
        ])
            .then(userPref => {

            })
    }
}

module.exports = {
    Similars
};
