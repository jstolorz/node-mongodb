const {MongoClient} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) =>{
    if(err){
        return console.log('Unable to connect to mongodb');
    }

    console.log('MongoDB connected ...');

    let db = client.db('TodoApp');

    db.collection('Todos').find().count().then((count) =>{
        console.log('Todos document count is :', count);
    }, (err) => {
        console.log('Unable to fetch Todos', err);
    });

    db.collection('Todos').find({completed: true}).toArray().then((docs) =>{
        console.log(JSON.stringify(docs,undefined,2));
    }, (err) =>{
        console.log('Unable to fetch Todos', err);
    });

    db.collection('Users').find({name: 'Janusz'}).toArray().then((docs) =>{
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) =>{
        console.log('Unable to fetch Users',err);
    });


    client.close();
    console.log('MongoDB disconnected ...');
});