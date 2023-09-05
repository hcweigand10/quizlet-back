const typeDefs = `
  type User {
    _id: ID!
    username: String!
    deckCount: Int
    decks: [Deck]
  }

  type Deck {
    _id: ID!
    name: String!
    cards: [Card]
    scores: [Score]
  }

  type Card {
    _id: ID!
    prompt: String
    answer: String
  }

  type Score {
    _id: ID!
    score: Number
    type: String
    user: User
  }

  type Query {
    profile: User
    allDecks: [Decks]
    deck: Deck
  }

  type Mutation {
    login(username: String!, password: String!): Auth
    addUser(username: String!, password: String!): Auth
    addDeck(name: String!, description: String): User
    updateDeck(name: String!, description: String): User
    removeDeck(deckId: ID!): User
    addCard(prompt: String!, answer: String!): Deck
    updateCard(prompt: String!, answer: String!): Deck
    removeCard(cardId: ID!): Deck
    addScore(deckId: ID!, score: Number!, userId: ID!): Deck
  }
`

module.exports = typeDefs