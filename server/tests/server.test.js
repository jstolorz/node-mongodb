const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {ListaZadan} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./sead/sead.js');


beforeEach(populateTodos);
beforeEach(populateUsers);

describe('POST /todos', () =>{

    it('should create a new todo', (done) => {

        let text = 'Test to do text';

        request(app)
            .post('/todos')
            .set('x-auth',users[0].tokens[0].token)
            .send({text})
            .expect(200)
            .end((err,res)=>{
                if(err){
                    return done(err);
                }

                ListaZadan.find({text}).then((todos)=>{
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should not create todos with invalid body data', (done) => {
        request(app)
            .post('/todos')
            .set('x-auth',users[0].tokens[0].token)
            .send({})
            .expect(400)
            .end((err,res) =>{
               if(err){
                   return done(err);
               }

               ListaZadan.find().then((todos)=>{
                   expect(todos.length).toBe(2);
                   done();
               }).catch((e)=>done(e));

            });
    });
});

describe('GET /todos', ()=>{

    it('should get all todos', (done) => {
       request(app)
           .get('/todos')
           .set('x-auth',users[0].tokens[0].token)
           .expect(200)
           .expect((res)=>{
               expect(res.body.todos.length).toBe(1);
           })
           .end(done);
    });

});

describe('GET /todos/:id', () => {

    it('schould return todo doc', (done) => {

        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .set('x-auth',users[0].tokens[0].token)
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('schould not return todo doc created by other user', (done) => {

        request(app)
            .get(`/todos/${todos[1]._id.toHexString()}`)
            .set('x-auth',users[0].tokens[0].token)
            .expect(404)
            .end(done);

    });

    it('schould return 404 if todo not found', (done) => {
        let hexId = new ObjectID().toHexString();

        request(app)
            .get(`/todos/${hexId}`)
            .set('x-auth',users[0].tokens[0].token)
            .expect(404)
            .end(done);

    });

    it('schould return 404 if non-object id', (done) => {
        let hexId = new ObjectID().toHexString();

        request(app)
            .get('/todos/123f')
            .set('x-auth',users[0].tokens[0].token)
            .expect(404)
            .end(done);

    });


});


describe('DELETE /todos/:id',() => {

    it('schould delete todos by id', (done) => {

        let hexId = todos[0]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth',users[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {

                if(err){
                    return done(err);
                }

                ListaZadan.findById(hexId).then((todo) => {
                    expect(todo).toNotExist();
                    done();
                }).catch((e) => {
                    done(e);
                });

            });
    });

    it('should not delete todoes by not exist id', (done) => {

        let hexId = new ObjectID().toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth',users[0].tokens[0].token)
            .expect(404)
            .end(done);

    });

    it('should not delete todos by wrong id', (done) => {
        let id = '3425aaaa';


        request(app)
            .delete(`/todos/${id}`)
            .set('x-auth',users[0].tokens[0].token)
            .expect(404)
            .end(done);

    });

});


describe('PATCH /todos/:id', () => {

    it('schould update todo by id with commpletedAt', (done) => {

        let hexId = todos[0]._id.toHexString();
        let text = 'This should be a new text';

        request(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth', users[0].tokens[0].token)
            .send({
                completed: true,
                text
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toBeA('number');
            })
            .end(done)
    });

    it('should not update the todo created by other user', (done) => {
        var hexId = todos[0]._id.toHexString();
        var text = 'This should be the new text';

        request(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .send({
                completed: true,
                text
            })
            .expect(404)
            .end(done);
    });

    it('schould update todo by id without commpletedAt', (done) => {

        let hexId = todos[0]._id.toHexString();
        let text = 'This should be a new text';

        request(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth', users[0].tokens[0].token)
            .send({
                completed: false,
                text
            })
            .expect(200)
            .expect((res) =>{
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toNotExist();
            })
            .end(done);

    });

});

describe('GET /users/me', () => {

    it('should return user if autenticated',  (done) => {

        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);

            }).end(done);

    });

    it('should return 401 if not authenticated', (done) => {

        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
               expect(res.body).toEqual({});
            }).end(done);
    });
});

describe('POST /users', () => {

    it('should create user', (done) => {

        let email = 'example@example.com';
        let password = 'npm123!';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(200)
            .expect((res) => {

                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);

            }).end((err) => {

                if(err){
                    return done(err);
                }

                User.findOne({email}).then((user) => {
                    expect(user).toExist();
                    expect(user.password).toNotBe(password);
                    done();
                });

        });


    });


    it('should return to validation error if request involis', (done) => {

        request(app)
            .post('/users')
            .send({
                email: 'olo',
                password: 'sasa'
            })
            .expect(400)
            .end(done);

    });

    it('should not create use if email is in use', (done) => {

        request(app)
            .post('/users')
            .send({
                email: users[0].email,
                password: 'asasas'
            })
            .expect(400)
            .end(done);


    });

});


describe('POST /users/login', () => {

    it('should login user and return token ', (done) => {

        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
            })
            .end((err, res) => {

                if(err){
                   return done(err)
                }

                User.findById(users[1]._id).then((user) => {

                    expect(user.tokens[1]).toInclude({
                        access: 'auth',
                        token: res.headers['x-auth']
                    });

                    done();
                }).catch((e) => done(e));

            });

    });

    it('should not login user and return token ', (done) => {

        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password + '1'
            })
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toNotExist();
            })
            .end((err, res) => {

                if(err){
                    return done(err)
                }

                User.findById(users[1]._id).then((user) => {

                    expect(user.tokens.length).toBe(1);

                    done();
                }).catch((e) => done(e));

            });

    });

});


describe('DELETE /users/me/token', () => {

    it('Should delete useers token', (done) => {

        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err, req) =>{
                if(err){
                    return done(err);
                }

                User.findById(users[0]._id).then((user) => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((e) => done(e));

            });

    });

});

