/*
const handleListen = require('./handleListen');

test('should call log with Example app...', () => {
    const PORT = 3000;
    const log = jest.fn();
    handleListen(log, PORT);
    expect(log.mock.calls).toHaveLength(1);
    expect(log.mock.calls[0][0]).toBe(`Example app listening on port ${PORT.toString()}!`);
});


const hello = require('./hello');

test('should call res.send with Hello World!', () => {
    const send = jest.fn();
    const res = {
        send,
    };
    hello({}, res);
    expect(send.mock.calls).toHaveLength(1);
    expect(send.mock.calls[0][0]).toBe('Hello World!');
});

const request = require('supertest');
const app = require('./app');

test('should pass integration tests', (done) => {
    request(app)
        .get('/')
        .expect(200, 'Hello World!')
        .end((err) => {
            if (err) throw done(err);
            done();
        });
});
*/

const user = require('../routes/user');
const request = require('supertest');
/*
describe('Test the root path', () => {
    test('It should response the GET method', (done) => {
        request(app).get('/').then((response) => {
            expect(response.statusCode).toBe(200);
            done();
        });
    });
});
*/

test('tests something...', () => {
    //const PORT = 3000;
    //const log = jest.fn();
    //user(log, PORT);
    //expect(log.mock.calls).toHaveLength(1);
    //expect(log.mock.calls[0][0]).toBe(`Example app listening on port ${PORT.toString()}!`);

    //router.post('/login', (req, res) => {

    /*
    const send = jest.fn();
    const res = {
        send,
    };
    */
    /*
    let body = {
        username:"thing00",
        password:"password00"

    };

    let req = {
        body
    };

    let res;

    user('/login', (req, res));
    */

    return request(user).get('/me').then(response => {
        expect(response.statusCode).toBe(200)
    })

    /*
    req.body.username req.body.password
    //username with @ without @

    res.json({
        message: 'Login successful',
        user: user,
        token: 'Bearer ' + jwt.sign(user.toObject(),
            cfg.jwtSecret, {expiresIn: '14 days'})
    });

    res.json({
        success: false,
        message: 'Please enter valid login details'
    });

    res.status(400).json({
        message: 'Invalid credentials, please try again.'
    });

    res.status(500).json({
        success: false,
        message: err.message
    });

    res.status(401).json({
        message: 'All information not provided'
    });
    */
});