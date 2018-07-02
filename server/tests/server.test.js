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
           .expect(200)
           .expect((res)=>{
               expect(res.body.todos.length).toBe(2);
           })
           .end(done);
    });

});

describe('DELETE /todos/:id',() => {

    it('schould delete todos by id', (done) => {

        let hexId = todos[0]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
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
            .expect(404)
            .end(done);

    });

    it('should not delete todos by wrong id', (done) => {
        let id = '3425aaaa';


        request(app)
            .delete(`/todos/${id}`)
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

    it('schould update todo by id without commpletedAt', (done) => {

        let hexId = todos[0]._id.toHexString();
        let text = 'This should be a new text';

        request(app)
            .patch(`/todos/${hexId}`)
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


