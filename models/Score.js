const { Schema, model } = require('mongoose')


const scoreSchema = new Schema({
  score: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
},
{
  toJSON: {
    virtuals: true
  }
})

module.exports = scoreSchema