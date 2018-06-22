const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {ListaZadan} = require('./../models/todo');

beforeEach((done) => {
    ListaZadan.remove({}).then(() => done());
});

describe('POST /todos', () =>{

    it('should create a new todo', (done) => {

        let text = 'Test to do text';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .end((err,res) =>{

                if(err){
                    return(done(err));
                }

                done();

            }).catch((e) => done(e));

    });

});

