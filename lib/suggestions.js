const moduleRecommendation = require('../models/recommendations');

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

    update(user, done) {

    }
}

module.exports = {
    Suggestions
};