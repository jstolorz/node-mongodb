let express  = require('express');
let bodyParser = require('body-parser');

let {mongoose} = require('./db/mongoose');
let {ListaZadan} = require('./models/todo');
let {User} = require('./models/user');
let {ObjectID} = require('mongodb');

const port = process.env.PORT || 3000;

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



// app.listen(3000, ()=>{
//    console.log('Started on port 3000');
// });

app.listen(port, () => {
    console.log(`Started up at port ${port}`);
});

module.exports = {app};

