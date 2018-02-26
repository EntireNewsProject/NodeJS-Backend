const moduleRecommendation = require('../models/recommendations');

class Similars {
    constructor(engine) {
        this.engine = engine;
        this.db = moduleRecommendation.Similars;
    }

    byUser(user) {
        return new Promise((resolve, reject) => {
            this.db.findById(user._id, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            })
        })
    }

    update(user) {
        return Promise.all([
            null,
            null
        ])
    }
}

module.exports = {
    Similars
};
