const { Schema, model } = require("mongoose");

const cardSchema = require("./Card");
const scoreSchema = require("./Score");

const deckSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    cards: [cardSchema],
    scores: [scoreSchema],
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

deckSchema.virtual("cardCount").get(function() {
  return this.cards.length;
});

deckSchema.virtual("scoreCount").get(function() {
  return this.scores.length;
});

const Deck = model("Deck", deckSchema);

module.exports = Deck ;
