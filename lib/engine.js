const {Rater} = require('./rater');
const {Similars} = require('./similars');
const {Suggestions} = require('./suggestions');

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