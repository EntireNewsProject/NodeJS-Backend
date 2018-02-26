const moduleRecommendation = require('../models/recommendations');

class Suggestions {
    constructor(engine) {
        this.engine = engine;
        this.db = moduleRecommendation.Suggestions;
    }

    forUser(user) {

    }

    update(user) {

    }
}

module.exports = {
    Suggestions
};