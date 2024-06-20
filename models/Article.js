const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  author: {
    type: String,
    require: false
  },
  searchKeyword: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  publishedAt: {
    type: String,
    required: true
  },
  title: {
    type: String,
    require: false
  },
  source: {
    id: { type: String, required: false },
    name: { type: String, required: true },
  },
  url: {
    type: String,
    required: true,
    match: [/^http[s]?:\/\/.*/, 'Introduzca una URL válida'],
  },
  urlToImage: {
    type: String,
    required: true,
    match: [/(https?:\/\/.*\.(?:png|jpg))/i, 'Introduzca una URL válida'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    select: false,
  },
});

module.exports = mongoose.model('Article', articleSchema);