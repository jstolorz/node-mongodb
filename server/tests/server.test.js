const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {ListaZadan} = require('./../models/todo');

const todos = [{
    text: 'Nakarmić pasa'
},{
    text: 'Trening kettelball'
}];

// beforeEach((done) => {
//     ListaZadan.remove({})
//         .then(()=>{
//            return ListaZadan.insertMany(todos);
//         })
//         .then(() => done());
// });

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

