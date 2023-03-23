const { Schema, model, Types } = require("mongoose");

const BookSchema = new Schema({
    title: {type: String, required: true, trim: true, maxlength: 50},
    author: {type: String, required: true, trim: true},
    synopsis: {type: String},
    releaseYear: {type: Number, required: true},
    genre: {type: String},
    coverImage: {type: String, default: 'https://res.cloudinary.com/dptsbfvan/image/upload/v1679533946/pictures/file_nqffuu.png'},
    creator: {type: Types.ObjectId, ref: "User"},
});

const BookModel = model("Book", BookSchema);

module.exports = BookModel;