const express  = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const {ListaZadan} = require('./models/todo');

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

app.get('/todos/:id',(req,res)=>{
    let id = req.params.id;

    if(!ObjectID.isValid(id)){
        return res.status(400).send();
    }

    ListaZadan.findById(id).then((todos)=>{

        if(!todos){
            return res.status(400).send();
        }

        res.send({todos});
    },(e) => {
        res.status(400).send();
    });


});


app.listen(port, ()=>{
   console.log('Started on port 3000');
});



module.exports = {app};

