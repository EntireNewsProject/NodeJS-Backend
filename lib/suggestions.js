const moduleRecommendation = require('../models/recommendations');

class Suggestions {
    constructor(engine) {
        this.engine = engine;
        this.db = moduleRecommendation.Suggestions;
    }

    forUser(user, done) {
        this.db.findOne({userId: user._id})
            .exec()
            .then(({doc}) => {
                console.log('inside suggestions, suggestions is ', doc);
                done(null, doc)
            })
            .catch(err => done(err))
    }

    update(user, done) {

    }
}

module.exports = {
    Suggestions
};