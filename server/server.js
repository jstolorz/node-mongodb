const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

let ListaZadan = mongoose.model('ListaZadan',{
   text:{
       type: String,
       required: true,
       minlength: 1,
       trim: true
   },
   completed: {
       type: Boolean,
       default: false
   },
   completedAt: {
       type: Number,
       default: null
   }
});

let User = mongoose.model('User',{
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    }
});

// let obListaZadan = new ListaZadan({
//     text: 'Ugotować obiad'
// });
//
// obListaZadan.save().then((doc) =>{
//       console.log('Zapisano: ', doc);
//     },
//     (err)=>{
//       console.log('Problem z zapisem: ',err);
//     });


// let obListaZadan = new ListaZadan({
//     text: 'Zrobić zakupy',
//     //completed: true,
//     //completedAt: 21072018
// });
//
// obListaZadan.save().then((docs)=>{
//     console.log('Lista zapisana: ',docs);
// }, (err)=>{
//     console.log('Nie udało się zapisać: ',err);
// });

let obUser = new User({
    email: 'jstolorz@gmail.com'
});

obUser.save().then((docs)=>{
    console.log('Zapisano: ',docs);
}, (err)=>{
    console.log('Nie udało się zapisać: ',err);
});





