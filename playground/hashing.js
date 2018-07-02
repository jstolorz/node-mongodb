const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

let password = '123abc!';

bcrypt.genSalt(10, (err, salt) => {
    console.log(salt);

    bcrypt.hash(password, salt, (err, hash) => {
        console.log(hash);
    });

});


// let data = {
//     id: 10
// };
//
//
// let token = jwt.sign(data, 'olobolo');
// console.log(token);
//
// let decode = jwt.verify(token, 'olobolo');
// console.log(decode);
//
