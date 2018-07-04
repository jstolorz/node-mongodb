let env = process.env.NODE_ENV || 'development';

if(env === 'development' || env === 'test'){

    let config = require('./config.json');
    let envConfig = config[env];

    console.log(envConfig);

}


// if(env === 'development'){
//     process.env.PORT = 3000;
//     process.env.MONGOLAB_CRIMSON_URI = 'mongodb://localhost:27017/TodoApp';
// }else if(env === 'test'){
//     process.env.PORT = 3000;
//     process.env.MONGOLAB_CRIMSON_URI = 'mongodb://localhost:27017/TodoAppTest';
// }