const Rater = require('./rater.js');
const Similars = require('./similars.js');
const Suggestions = require('./suggestions.js');

class Engine {
    constructor() {
        this.likes = new Rater(this, 'likes');
        //this.dislikes = new Rater(this, 'dislikes');
        this.views = new Rater(this, 'views');
        this.similars = new Similars(this);
        this.suggestions = new Suggestions(this);
    }
}

module.exports = {
    Engine
};
