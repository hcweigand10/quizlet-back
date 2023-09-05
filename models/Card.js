const { Schema, model } = require('mongoose')


const cardSchema = new Schema({
  prompt: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
},
{
  toJSON: {
    virtuals: true
  }
})

module.exports = cardSchema