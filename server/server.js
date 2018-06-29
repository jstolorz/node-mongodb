require('./config/config');

const express  = require('express');
const bodyParser = require('body-parser');
const {mongoose} = require('./db/mongoose');
const _ = require('lodash');

let {ListaZadan} = require('./models/todo');
let {User} = require('./models/user');
let {ObjectID} = require('mongodb');

const port = process.env.PORT;

let app = express();

app.use(bodyParser.json());

app.post('/todos',(req,res)=>{
    let listaZadan = new ListaZadan({
        text: req.body.text,
        completed: req.body.completed,
        completedAt: req.body.completedAt
    });

    listaZadan.save().then((doc)=>{
        res.send(doc);
    }, (err)=>{
        res.status(400).send(err);
    });
});

app.get('/todos',(req,res)=>{
    ListaZadan.find().then((todos)=>{
        res.send({todos})
    },(e)=>{
        res.status(400).send(e);
    });
});


app.get('/todos/:id', (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    ListaZadan.findById(id).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }

        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    });
});


app.delete('/todos/:id',(req,res) => {

    let id = req.params.id;

    if(!ObjectID.isValid(id)){
        return res.status(404).send('Bed 400! id');
    }

    ListaZadan.findByIdAndRemove(id).then((todo) => {

        if(!todo){
            return res.status(404).send('Bed 400! remove');
        }

        res.send({todo});
    }).catch((e) => {
        res.status(400).send('Bed 400! catch');
    })

});


app.patch('/todos/:id', (req, res) =>{

    let id = req.params.id;
    let body = _.pick(req.body, ['text','completed']);

    if(!ObjectID.isValid(id)){
        return res.status(404).send("Bed id");
    }

    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    }else{
        body.completed = false;
        body.completedAt = null;
    }

    ListaZadan.findByIdAndUpdate(id, {$set:body}, {new: true}).then((todo) => {

        if(!todo){
            return res.status(404).send('Problem with update');
        }

        res.send({todo});

    }).catch((e) => {
        res.status(400).send('From catch');
    });

});

// POST /users
app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    })
});

// app.listen(3000, ()=>{
//    console.log('Started on port 3000');
// });

app.listen(port, () => {
    console.log(`Started up at port ${port}`);
});

module.exports = {app};

