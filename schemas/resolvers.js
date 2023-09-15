const { GraphQLError } = require("graphql");
const { Types } = require("mongoose")
const { User, Deck } = require("../models/index");
const {signToken} = require("../utils/auth")
const bcrypt = require("bcrypt");

const resolvers = {
  Query: {
    profile: async (parent, args, context) => {
      try {
        const userData = await User.findById(args.userId)
        if (!userData) {
          console.log("no user with this ID");
          throw new GraphQLError("No user with this ID");
        } else {
          const userDecks = await Deck.find({createdBy: new Types.ObjectId(args.userId)})
          return {user: userData, decks: userDecks}
        }
        
      } catch (error) {
        console.log(error)
      }
    },

    me: async (parent, args, context) => {
      try {
        const userData = await User.findById(context.user.id)
        if (!userData) {
          console.log("no user with this ID");
          throw new GraphQLError("No user with this ID");
        } else {
          const userDecks = await Deck.find({createdBy: new Types.ObjectId(context.user.id)})
          return {user: userData, decks: userDecks}
        }
        
      } catch (error) {
        console.log(error)
      }
    },
    allDecks: async (parent, args, context) => {
      try {
        const deckData = await Deck.find({}).populate("createdBy");
        return deckData;
        
      } catch (error) {
        console.log(error)
      }
    },
    allUsers: async (parent, args, context) => {
      try {
        const userData = await User.find({})
        return userData;
        
      } catch (error) {
        console.log(error)
      }
    },
    deck: async (parent, args, context) => {
      try {
        const deckData = await Deck.findById(new Types.ObjectId(args.deckId)).populate("createdBy");
        return deckData;
        
      } catch (error) {
        console.log(error)
      }
    },
  },

  Mutation: {
    addUser: async (parent, args) => {
      try {
        const user = await User.create(args);
        const token = signToken(user.username, user._id);
  
        return { token, user };
        
      } catch (error) {
        console.log(error)
      }
    },
    login: async (parent, args) => {
      try {
        const user = await User.findOne({ username: args.username });
  
        if (!user) {
          console.log("no user with this username");
          throw new GraphQLError("no user with this username");
        }
  
        const correctPw = bcrypt.compareSync(args.password, user.password);
  
        if (!correctPw) {
          console.log("wrong password");
          throw new GraphQLError("wrong password");
        }
  
        const token = signToken(user.username, user._id);
        return { token, user };
        
      } catch (error) {
        console.log(error)
      }
    },
    addDeck: async (parent, args) => {
      try {
        const user = await User.findById((args.userId))
        if (!user) {
          console.log("Deck created but no user with this username!");
          throw new GraphQLError("Deck created but no user with this username!");
        }
        const newDeck = await Deck.create({
          name: args.name,
          description: args.description,
          createdBy: new Types.ObjectId(args.userId)
        });
        // const updatedUser = await User.findOneAndUpdate(
        //   { _id: new Types.ObjectId(args.userId) },
        //   { $addToSet: { decks: newDeck._id } },
        //   { new: true }
        // );
  
  
        return newDeck.populate("createdBy");
        
      } catch (error) {
        console.log(error)
      }
    },
    updateDeck: async (parent, args) => {
      try {
        const deckData = await Deck.findOneAndUpdate(
          { _id: new Types.ObjectId(args.deckId) },
          { $set: { name: args.name, description: args.description } },
          { runValidators: true, new: true }
        );
  
        if (!deckData) {
          console.log("no deck with this id!");
          throw new GraphQLError("no deck with this id!");
        }
        return deckData;
        
      } catch (error) {
        console.log(error)
      }
    },
    removeDeck: async (parent, args) => {
      try {
        const oldDeck = await Deck.findByIdAndDelete(args.deckId);
  
        if (!oldDeck) {
          console.log("no deck with this ID");
          throw new GraphQLError("no deck with this id!");
        }
  
        // const userData = await User.findOneAndUpdate(
        //   { _id: args.userId },
        //   { $pull: { decks: { _id: new Types.ObjectId(args.deckId) } } },
        //   { new: true }
        // );
  
        return oldDeck;
        
      } catch (error) {
        console.log(error)
      }
    },
    addCard: async (parent, args) => {
      try {
        const newCard = { prompt: args.prompt, answer: args.answer };
        console.log(newCard)
        const deckData = await Deck.findOneAndUpdate(
          {
            _id: new Types.ObjectId(args.deckId),
          },
          { $addToSet: { cards: newCard } },
          { new: true }
        );
        if (!deckData) {
          throw new GraphQLError("no deck with this id!");
        }
        return deckData;
        
      } catch (error) {
        console.log(error)
      }
    },
    updateCard: async (parent, args) => {
      try {
        const deckData = await Deck.findOne({
          _id: new Types.ObjectId(args.deckId),
        });
        if (!deckData) {
          throw new GraphQLError("no deck with this id!");
        }
        const card = deckData.cards.id(new Types.ObjectId(args.cardId));
        if (card) {
          card.prompt = args.prompt;
          card.answer = args.answer;
        } else {
          console.log("no card with this ID");
          throw new GraphQLError("no card with that id");
        }
        await deckData.save();
  
        return deckData;
        
      } catch (error) {
        console.log(error)
      }
    },
    removeCard: async (parent, args) => {
      try {
        const deckData = await Deck.findOneAndUpdate(
          { _id: new Types.ObjectId(args.deckId) },
          { $pull: { cards: { _id: args.cardId } } },
          { new: true }
        );
        if (!deckData) {
          console.log("no deck with this id");
          throw new GraphQLError("no deck with this id!");
        }
  
        return deckData;
        
      } catch (error) {
        console.log(error)
      }
    },
    addScore: async (parent, args) => {
      try {
        const newScore = {
          score: args.score,
          type: args.type,
          user: new Types.ObjectId(args.userId),
        };
        const deckData = await Deck.findOneAndUpdate(
          { _id: new Types.ObjectId(args.deckId) },
          {
            $addToSet: { scores: newScore },
          },
          { new: true }
        );
        if (!deckData) {
          console.log("no deck with this id");
          throw new GraphQLError("no deck with this id!");
        }
        return deckData.populate("scores.user");
        
      } catch (error) {
        console.log(error)
      }
    },
  },
};

module.exports = resolvers
