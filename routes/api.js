/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var mongoose = require('mongoose');
var Book = require('../book-model');

const CONNECTION_STRING = process.env.DB; 

mongoose.connect(CONNECTION_STRING);
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    var listOfBooks = [];
    Book.find({}).cursor().on('data', function(book){
    var newBook = {};
      newBook._id = book._id;
      newBook.title = book.title;
      newBook.commentcount = book.comments.length;
      listOfBooks.push(newBook);
    }).on('error', function(err){
      return;
    }).on('close', function(){
      res.json(listOfBooks);
    })
     
    
    })
    
    .post(function (req, res){
      var title = req.body.title;
      //response will contain new book object including atleast _id and title
      if (!title){
        res.send('no title');
      }
      var newBook = new Book({
        title: title,
        comments: []
      })
      newBook.save();
      res.json(newBook);
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
    Book.remove(function (err){
      if (err) return;
      
      res.send('complete delete successful');
    });
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    Book.findById(bookid, function(err, foundBook){
      if (err) return;
      if (foundBook){
      res.json({ _id: bookid,
                title: foundBook.title,
                comments: foundBook.comments
      });
      } else {
        res.send('no book exists');
      }
    });
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      Book.findById(bookid, function(err, foundBook){
      if (err) return;
      if (foundBook){
      foundBook.comments.push(comment);
      foundBook.save();
      res.json({ _id: bookid,
                title: foundBook.title,
                comments: foundBook.comments
      });
      } else {
        res.send('no book exists');
      }
    });
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
    Book.findById(bookid, function(err, foundBook){
      if (err) return;
      if (foundBook){
      foundBook.remove();
      res.send('delete successful');
      } else {
        res.send('no book exists');
      }
    });
    });
  
};
