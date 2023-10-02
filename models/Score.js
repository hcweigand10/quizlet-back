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
  // deck: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'Deck',
  // }
},
{
  toJSON: {
    virtuals: true
  }
})


// const Score = model("Score", scoreSchema);

module.exports = scoreSchema


// const { Schema, model } = require('mongoose')


// const scoreSchema = new Schema({
//   score: {
//     type: Number,
//     required: true
//   },
//   type: {
//     type: String,
//     required: true
//   },
//   user: {
//     type: Schema.Types.ObjectId,
//     ref: 'User',
//   },
//   deck: {
//     type: Schema.Types.ObjectId,
//     ref: 'Deck',
//   }
// },
// {
//   toJSON: {
//     virtuals: true
//   }
// })

// const Score = model("Score", scoreSchema);


// module.exports = Score