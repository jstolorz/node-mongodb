let express  = require('express');
let bodyParser = require('body-parser');

let {mongoose} = require('./db/mongoose');
let {ListaZadan} = require('./models/todo');
let {User} = require('./models/user');


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

app.listen(3000, ()=>{
   console.log('Started on port 3000');
});



