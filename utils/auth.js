const jwt = require('jsonwebtoken');
const { GraphQLError } = require('graphql');
const secret = 'mysecretsshhhhh';
const expiration = '48h';

module.exports = {
  authMiddleware: ({ req }) => {
    console.log(req)
    // allows token to be sent via req.body, req.query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      return req;
    }

    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log('Invalid token');
    }

    return req;
  },
  signToken: (username, _id) => {
    const payload = { username, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  }
}