const {MongoClient} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) =>{
    if(err){
        return console.log('Unable to connect to mongodb');
    }

    console.log('MongoDB connected ...');

    let db = client.db('TodoApp');

    db.collection('Todos').deleteMany({text: "Something to do"}).then((result) =>{
        console.log(result);
    });


    client.close();
    console.log('MongoDB disconnected ...');
});