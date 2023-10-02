const typeDefs = `
  type User {
    _id: ID!
    username: String!
    icon: String!
  }

  type Profile {
    user: User
    decks: [Deck]
    scoreReports: [ScoreReport]
  }

  type ScoreReport {
    name: String!
    scores: [Score]
  }

  type Deck {
    _id: ID!
    name: String!
    description: String
    createdBy: User
    cards: [Card]
    scores: [Score]
    cardCount: Int
    scoreCount: Int
  }

  type Card {
    _id: ID!
    prompt: String
    answer: String
  }

  type Score {
    _id: ID!
    score: Int
    type: String
    deckId: ID!
    user: User
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    profile(userId: ID!): Profile
    me: Profile
    allDecks: [Deck]
    allUsers: [User]
    deck(deckId: ID!): Deck
  }

  type Mutation {
    login(username: String!, password: String!): Auth
    addUser(username: String!, password: String!): Auth
    updateUser(userId: ID!, username: String!, icon: String!): User
    addDeck(name: String!, description: String!, userId: ID!): Deck
    updateDeck(name: String!, description: String!, deckId: ID!): Deck
    removeDeck(deckId: ID!): Deck
    addCard(prompt: String!, answer: String!, deckId: ID!): Deck
    updateCard(prompt: String!, answer: String!, cardId: ID!, deckId: ID!): Deck
    removeCard(cardId: ID!, deckId: ID!): Deck
    addScore(deckId: ID!, score: Int!, type: String!, userId: ID!): Deck
  }
`

module.exports = typeDefs