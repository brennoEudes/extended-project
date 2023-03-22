const express = require("express");
const router = require("express").Router();
const bcrypt = require("bcryptjs");

const BookModel = require("../models/book.model");
const UserModel = require("../models/User.model");

const generateToken = require("../config/jwt.config");
const isAuthenticated = require("../middlewares/isAuthenticated");
const attachCurrentUser = require("../middlewares/attachCurrentUser");

const bookRouter = express.Router();

// usuário logado cria novo livro.
bookRouter.post(
  "/book",
  isAuthenticated,
  attachCurrentUser,
  async (req, res) => {
    try {
      const newBook = await BookModel.create({
        ...req.body,
        creator: req.currentUser._id,
      });

      await UserModel.findOneAndUpdate(
        { _id: req.currentUser._id },
        { $push: { books: newBook._id } },
        { new: true, runValidators: true }
      );

      return res.status(201).json(newBook);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
);

// todos os usuários podem ver todos os livros.
bookRouter.get("/", async (req, res) => {
  try {
    const books = await BookModel.find({}, { body: 0 }); // como deixar somente title e author?

    return res.status(200).json(books);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// todos os usuários veem os detalhes de todos os livros.
bookRouter.get("/:id", async (req, res) => {
  try {
    const book = await BookModel.findOne({ _id: req.params.bookId }).populate(
      "creator"
    );

    delete book._doc.creator.passwordHash;

    return res.status(200).json(book);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

// usuário logado edita livro criado por ele mesmo.
bookRouter.put("/:id", isAuthenticated, attachCurrentUser, async (req, res) => {
    try {
      if (!req.currentUser.book.includes(req.params.bookId)) {
        return res.status(401).json("You do not have permission.");
      }
  
      const updatedBook = await BookModel.findOneAndUpdate(
        { _id: req.params.bookId },
        { ...req.body },
        { new: true, runValidators: true }
      );
  
      return res.status(200).json(updatedBook);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  });



module.exports = router;
