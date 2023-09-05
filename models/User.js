const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const {deckSchema} = require("./Deck")

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  decks: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Deck',
    },
  ],
},
{
  toJSON: {
    virtuals: true
  }
})

// hash user password
userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

userSchema.virtual('deckCount').get(() => {
  return this.decks.length;
});

const User = model('User', userSchema);

module.exports = User