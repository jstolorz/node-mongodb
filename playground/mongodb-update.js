const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err,client)=>{

    if(err){
        return console.log('Unable to connect to MongoDB');
    }

    console.log('Connected to MongoDB...');

    let db = client.db('TodoApp');

    db.collection('Todos').findOneAndUpdate({
        _id: new ObjectID('5b2a20ab06183b25070f2f11')
    },{
        $set: {
            completed: true
        }
    },{
        returnOriginal: false
    }).then((result) =>{
        console.log(result);
    });


    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5b2a20ab06183b25070f2f12')
    },
        {
        $set: {
          name: 'Olo'
        },
        $inc: {
          age: 1
        }
    },{
        returnOriginal: false
    }).then((result)=>{
        console.log(result);
    });


    // db.collection('Users').findOneAndUpdate({
    //     _id: new ObjectID('5b2a20ab06183b25070f2f12')
    // }, {
    //     $set: {
    //         name: 'Andrew'
    //     },
    //     $inc: {
    //         age: 1
    //     }
    // }, {
    //     returnOriginal: false
    // }).then((result) => {
    //     console.log(result);
    // });


    client.close();

    console.log('disconnected to MongoDB...');

});