const express = require('express');
const path = require('path');
// Import the ApolloServer class
const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const { expressMiddleware } = require('@apollo/server/express4');
// const { authMiddleware } = require('./utils/auth');

// Import the two parts of a GraphQL schema
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  // plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
const httpServer = http.createServer(app);



// Create a new instance of an Apollo server with the GraphQL schema
const startApolloServer = async () => {
  await server.start();
  
  app.use(
    '/graphql', 
  cors(),
  bodyParser.json({ limit: '50mb' }),
  expressMiddleware(server));

  db.once('open', () => {
    httpServer.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
    });
  });
};

// Call the async function to start the server
startApolloServer();
