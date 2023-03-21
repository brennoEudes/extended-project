const express = require('express');
const router = require("express").Router();
const bcrypt = require("bcryptjs");

const BookModel = require("../models/book.model");
const UserModel = require('../models/User.model');

const generateToken = require("../config/jwt.config");
const isAuthenticated = require("../middlewares/isAuthenticated");
const attachCurrentUser = require("../middlewares/attachCurrentUser");


const bookRouter = express.Router();

bookRouter.post("/", isAuthenticated, attachCurrentUser, async (req, res) => {
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
});



module.exports = router;