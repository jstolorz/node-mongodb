const jwt = require('jsonwebtoken');

let data = {
    id: 10
};


let token = jwt.sign(data, 'olobolo');
console.log(token);

let decode = jwt.verify(token, 'olobolo');
console.log(decode);

