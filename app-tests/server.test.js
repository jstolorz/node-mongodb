const request = require('supertest');
const expect = require('expect');

var app = require('../server/server_express').app;

describe('Server', () => {


    describe('GET /', () => {
        it('should return hello world', (done)=>{
            request(app)
                .get('/')
                .expect(200)
                .expect('Hello on my Page')
                .end(done);
        });
    });

    describe('GET /users', () =>{

        it('should return my user object', (done) => {
            request(app)
                .get('/users')
                .expect(200)
                .expect((res) => {
                    expect(res.body).toInclude({
                        name: 'Andrew',
                        age: 25
                    });
                })
                .end(done);
        });

        it('should return my user object', (done) => {
            request(app)
                .get('/users')
                .expect(200)
                .expect((res) => {
                    expect(res.body).toInclude({
                        name: 'Jen',
                        age: 26
                    });
                })
                .end(done);
        });


    });




});

