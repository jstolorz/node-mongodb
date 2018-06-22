let mongoose = require('mongoose');

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

module.exports = {ListaZadan};