const express = require('express');

let app = express();

app.get('/', (req, res) =>{
    res.send('Hello on my Page');
});

app.get('/users', (req, res) => {
    res.send([{
        name: 'Mike',
        age: 27
    }, {
        name: 'Andrew',
        age: 25
    }, {
        name: 'Jen',
        age: 26
    }]);
});

app.listen(3001);
module.exports.app = app;