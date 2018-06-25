const {mongoose} = require('../server/db/mongoose');
const {ListaZadan} = require('../server/models/todo');
const {User} = require('../server/models/user');

let id = '5b30d93396affd46aae63bd6';

ListaZadan.find({
    _id: id
}).then((todos)=>{
    console.log(todos);
});

ListaZadan.findOne({
    _id: id
}).then((todos)=>{
   console.log(todos);
});

ListaZadan.findById(id).then((todo)=>{
    if(!todo){
      return console.log('Id not found');
    }

    console.log(todo);

}).catch((e) => console.log(e));


User.findById('5b2bb1f306f9db4d237ebd3b').then((user)=>{
   if(!user){
       return console.log('User not found');
   }

   console.log(JSON.stringify(user,undefined,2));
}, (e) => {
    console.log(e);
});