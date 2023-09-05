const { GraphQLError } = require("graphql");
const { User, Deck } = require("../models/index");
const bcrypt = require("bcyrpt");

const resolvers = {
  Query: {
    profile: async (parent, args, context) => {
      const userData = User.findById(args.userId).populate("decks");
      if (!userData) {
        console.log("no user with this ID");
        throw new GraphQLError("No user with this ID");
      }
      return userData;
    },
    allDecks: async (parent, args, context) => {
      const deckData = Deck.find({});
      return deckData;
    },
    deck: async (parent, args, context) => {
      const deckData = Deck.findById(args.deckId);
      return deckData;
    },
  },

  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    login: async (parent, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user) {
        console.log("no user with this username");
        throw new GraphQLError("no user with this username");
      }

      const correctPw = await bcrypt.compareSync(args.password, user.password);

      if (!correctPw) {
        console.log();
        throw new GraphQLError("wrong password");
      }

      const token = signToken(user);
      return { token, user };
    },
    addDeck: async (parent, args) => {
      const newDeck = await Deck.create({
        name: args.name,
        description: args.description,
      });
      const updatedUser = await User.findByIdAndUpdate(
        { _id: args.userId },
        { $push: { decks: newDeck._id } },
        { new: true }
      );

      if (!dbUserData) {
        console.log("Deck created but no user with this id!");
        throw new GraphQLError("Deck created but no user with this id!");
      }

      return { updatedUser };
    },
    updateDeck: async (parent, args) => {
      const deckData = await Deck.findOneAndUpdate(
        { _id: args.deckId },
        { $set: { name: args.name, description: args.description } },
        { runValidators: true, new: true }
      );

      if (!deckData) {
        throw new GraphQLError("no deck with this id!");
      }
      return deckData;
    },
    removeDeck: async (parent, args) => {
      const oldDeck = await Deck.findByIdAndDelete(args.deckId);

      if (!oldDeck) {
        console.log("no deck with this ID");
        throw new GraphQLError("no deck with this id!");
      }

      const userData = User.findOneAndUpdate(
        { _id: args.userId },
        { $pull: { decks: { _id: args.deckId } } },
        { new: true }
      );

      return userData;
    },
    addCard: async (parent, args) => {
      const newCard = { prompt: args.prompt, answer: args.answer };
      const deckData = await Deck.findByIdAndUpdate(
        {
          _id: args.deckId,
        },
        { $addToSet: { decks: newCard } },
        { new: true }
      );
      if (!deckData) {
        throw new GraphQLError("no deck with this id!");
      }
      return deckData;
    },
    updateCard: async (parent, args) => {
      const deckData = await Deck.findOne({
        _id: args.deckId,
      });
      const card = deckData.cards.id(args.cardId);
      if (card) {
        card.prompt = args.prompt;
        card.answer = args.answer;
      } else {
        console.log("no card with this ID");
        throw new GraphQLError("no card with that id");
      }
      card.save((err) => {
        if (err) {
          console.log(err);
        }
      });

      return card;
    },
    removeCard: async (parent, args) => {
      const deckData = await Deck.findOneAndUpdate(
        { _id: args.userId },
        { $pull: { cards: { _id: args.cardId } } },
        { new: true }
      );
      if (!deckData) {
        console.log("no deck with this id");
        throw new GraphQLError("no deck with this id!");
      }

      return deckData;
    },
    addScore: async (parent, args) => {
      const newScore = {
        score: args.score,
        type: args.type,
        user: args.userId,
      };
      const deckData = Deck.findOneAndUpdate(
        { _id: args.deckId },
        {
          $addToSet: { scores: newScore },
        },
        { new: true }
      );
      if (!deckData) {
        console.log("no deck with this id");
        throw new GraphQLError("no deck with this id!");
      }
      return deckData;
    },
  },
};
