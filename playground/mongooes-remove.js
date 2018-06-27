const {mongoose} = require('../server/db/mongoose');
const {ListaZadan} = require('../server/models/todo');
const {User} = require('../server/models/user');

// ListaZadan.findOneAndRemove({_id: '5b321a20abe12336bddaf15e'}).then((todo) => {
//    console.log(todo);
// });

ListaZadan.findByIdAndRemove('5b323415e302c94ec060125f').then((todo)=>{
    console.log(todo);
});