const moduleRecommendation = require('../models/recommendations');

const pluck = (arr, key) => arr.map(obj => obj[key]);

class Rater {
    constructor(engine, kind) {
        this.engine = engine;
        this.kind = kind;
        this.db = moduleRecommendation[kind]; //'Likes'
    }

    add(user, news, done) {
        const params = {};

        params.userId = user._id;
        params.newsId = news._id;
        const action = new this.db(params);
        let newAction = new this.db();

        newAction.save()
            .then(() => {
                return Promise.all([
                    this.engine.similars.update(user),
                    this.engine.suggestions.update(user)
                ]);
            })
            .then(() => {
                console.log('Action complete');
                return done();
            })
            .catch(err => done(err))
    }

    remove(user, news, done) {
        this.db.findOneAndRemove({userId: user._id, newsId: news._id})
            .exec()
            .then(() => {
                return Promise.all([
                    this.engine.similars.update(user),
                    this.engine.suggestions.update(user)
                ]);
            })
            .then(() => {
                console.log('Action complete');
                return done();
            })
            .catch(err => done(err))
    }

    itemsByUser(user, done) {
        this.db.findOne({userId: user._id})
            .exec()
            .then(doc => done(null, doc)) //pluck(doc, 'itemId')
            .catch(err => done(err))
    }

    usersByItems(item, done) {
        this.db.findOne({itemId: item._id})
            .exec()
            .then(doc => done(null, doc)) //pluck(doc, 'userId')
            .catch(err => done(err))
    }
}

module.exports = {
    Rater
};