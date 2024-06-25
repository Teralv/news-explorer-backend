/* eslint-disable */
const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    require: [true, 'article keyword is required']
  },
  title: {
    type: String,
    require: [true, 'article title is required']
  },
  text: {
    type: String,
    required: [true, 'article text is required']
  },
  date: {
    type: String,
    required: [true, 'article date is required']
  },
  source: {
    id: { type: String, required: false },
    name: { type: String, required: true },
  },
  link: {
    type: String,
    required: true,
    match: [/^http[s]?:\/\/.*/, 'Introduzca una URL válida'],
  },
  image: {
    type: String,
    required: false,
    match: [/^http[s]?:\/\/.*/, 'Introduzca una URL válida'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    select: false,
  },
});

module.exports = mongoose.model('Article', articleSchema);