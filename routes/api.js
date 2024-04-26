'use strict';
const Book = require('../models.js').Book;

module.exports = function (app) {
  
  app.route('/api/books')
    .get(async function (req, res) {
      try {
        const result = await Book.find({});
        const formatData = result.map(book => ({
          _id: book._id,
          title: book.title,
          comments: book.comments,
          commentcount: book.comments.length
        }));
        res.json(formatData);
      } catch (error) {
        res.json([]);
      }
    })
    
    .post(async function (req, res) {
      try {
        const title = req.body.title;
        if (!title) {
          res.send("Missing the require field comment");
          return;
        }
        const newBook = new Book({ title, comments: [] });
        const result = await newBook.save();
        res.json({ title: result.title, _id: result._id });
      } catch (error) {
        res.send("Error saving the book");
      }
    })
    
    .delete(async function (req, res) {
      try {
        await Book.deleteMany({});
        res.send("complete delete successful");
      } catch (error) {
        res.send("Error deleting books");
      }
    });

  app.route('/api/books/:id')
    .get(async function (req, res) {
      try {
        const bookid = req.params.id;
        const book = await Book.findById(bookid);
        if (!book) {
          res.send("no book exists");
        } else {
          res.json({
            comments: book.comments,
            _id: book._id,
            title: book.title,
            commentcount: book.comments.length
          });
        }
      } catch (error) {
        res.send("Error fetching book details");
      }
    })
    
    .post(async function (req, res) {
      try {
        const bookid = req.params.id;
        const comment = req.body.comment;
        if (!comment) {
          res.send("missing required field comment");
          return;
        }
        const book = await Book.findById(bookid);
        if (!book) {
          res.send("no book exists");
        } else {
          book.comments.push(comment);
          await book.save();
          res.json({
            comments: book.comments,
            _id: book._id,
            title: book.title,
            commentcount: book.comments.length
          });
        }
      } catch (error) {
        res.send("Error adding comment to book");
      }
    })
    
    
    .delete(async function (req, res) {
      try {
        const bookid = req.params.id;
        await Book.findByIdAndDelete(bookid);
        res.send("delete successful");
      } catch (error) {
        res.send("Error deleting book");
      }
    });
};
