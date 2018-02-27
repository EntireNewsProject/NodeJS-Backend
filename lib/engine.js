const Rater = require('./rater.js');
const Similars = require('./similars.js');
const Suggestions = require('./suggestions.js');

class Engine {
    constructor() {
        this.views = new Rater(this, 'Views');
        this.ignored = new Rater(this, 'Ignored');
        this.similars = new Similars(this);
        this.suggestions = new Suggestions(this);
    }
}

module.exports = {
    Engine
};
