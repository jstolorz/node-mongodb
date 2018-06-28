let mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGOLAB_CRIMSON_URI);

module.exports = {mongoose};