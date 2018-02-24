const moduleRecommendation = require('../models/recommendations');

class Rater {
    constructor(engine, kind) {
        this.engine = engine;
        this.kind = kind;
        this.db = moduleRecommendation[kind]; //'Likes'
    }

    add(user, news) {
        const params = {};

        params.userId = user._id;
        params.newsId = news._id;
        const action = new this.db(params);
        let newAction = new this.db();

        newAction.save()
            .then(result => {
                this.engine.similars.update(user);
                this.engine.suggestions.update(user);
                console.log('Action complete');
            })
            .catch(err => {
                console.log(err);
            })
    }

    remove(user, news) {
        this.db.findOneAndRemove({_userId: user._id, newsId: news._id})
            .exec()
            .then(result => {
                this.engine.similars.update(user);
                this.engine.suggestions.update(user);
                console.log('Action complete');
            })
            .catch(err => {
                console.log(err);
            })
    }
}
