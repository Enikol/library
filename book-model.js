var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Book = new Schema({
  title: {type: String, required: true},
  comments: [String]
});

module.exports = mongoose.model('Book', Book);