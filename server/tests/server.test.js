const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {ListaZadan} = require('./../models/todo');

const todos = [{
    _id: new ObjectID(),
    text: 'Nakarmić pasa'
},{
    _id: new ObjectID(),
    text: 'Trening kettelball'
}];

 beforeEach((done) => {
     ListaZadan.remove({})
         .then(()=>{
            return ListaZadan.insertMany(todos);
         })
         .then(() => done());
});

describe('POST /todos', () =>{

    it('should create a new todo', (done) => {

        let text = 'Test to do text 2';

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


describe('Get /todos/:id', ()=>{

    it("should return todos doc by id",(done)=>{

        request(app)
            .get(`/todos/${todos[0]._id.toString()}`)
            .expect(200)
            .expect((res)=>{
                expect(res.body.todos.text).toBe(todos[0].text);
            })
            .end(done);

    });

    it('should not return todos by id', (done) => {
        request(app)
            .get('/todos/23456')
            .expect(400)
            .end(done);
    });

    it('should return 404 not found', (done) => {
        var hexId = new ObjectID().toHexString();

        request(app)
            .get(`/todos/${hexId}`)
            .expect(400)
            .end(done);
    });


});


