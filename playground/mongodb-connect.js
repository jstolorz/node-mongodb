//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) =>{

    if(err){
       return console.log('Unable to connect to MongoDB server');
    }

    console.log('Connected to MongoDB Server');

    let db = client.db('TodoApp');

    db.collection('Todos').insertOne({

        text: 'Something to do th',
        completed: false

    }, (err, result) => {
        if(err){
            return console.log('Unable it insert into Todos',err);
        }

        console.log(JSON.stringify(result.ops, undefined,2));
    });


    db.collection('Users').insertOne({

        name: 'Iwona',
        email: 'iwona@gmail.com',
        location: 'Jaworze'

    }, (err, result) => {
        if(err){
            return console.log('Unable it insert into Users',err);
        }

        console.log(JSON.stringify(result.ops, undefined,2));
    });


    client.close();
    console.log('disconnected from MongoDB Server');
});