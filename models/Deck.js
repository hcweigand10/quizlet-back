const { Schema, model } = require('mongoose')

const cardSchema = require('./Card')
const scoreSchema = require('./Score')

const deckSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  cards: [cardSchema],
  scores: [scoreSchema]

},
{
  toJSON: {
    virtuals: true
  }
})

deckSchema.virtual("cardCount").get(() => {
  return this.cards.length
})

deckSchema.virtual("scoreCount").get(() => {
  return this.scores.length
})

const Deck = model("Deck", deckSchema)

module.exports = {deckSchema, Deck}