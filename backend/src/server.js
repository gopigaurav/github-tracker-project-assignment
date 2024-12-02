import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { gql } from 'apollo-server-express';
import repositoryResolver from './resolvers/respositoryResolver.js';
import releaseResolver from './resolvers/releaseResolver.js';
import sequelize from './database/sequelize.js';
import cors from 'cors';

// Combine repository and release resolvers
const resolvers = {
  Query: {
    ...repositoryResolver.Query,
    ...releaseResolver.Query,
  },
  Mutation: {
    ...repositoryResolver.Mutation,
    ...releaseResolver.Mutation,
  },
};

// Define GraphQL schema
const typeDefs = gql`
type Repository {
  id: Int
  name: String
  url: String
  description: String
  tracked: Boolean
  createdAt: String
  updatedAt: String
}

type Release {
  id: Int
  version: String
  publishedAt: String
  seenByUser: Boolean
  repositoryId: Int
  repository: Repository
  createdAt: String
  updatedAt: String
  body: String
  html_url:String
}

type Query {
  repositories: [Repository]
  releases(repositoryId: Int!): [Release]
}

type Mutation {
  addRepository(name: String!, url: String!, description: String): Repository
  markAsSeen(releaseId: Int!): Release,
  markAsSeenRepo(repositoryId: Int!): Repository,
  addRelease(version: String!, publishedAt: String!, repositoryId: Int!): Release
}
`;

const server = new ApolloServer({
  typeDefs,
  resolvers,
});
const app = express();
app.use(cors());

app.use((req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  next(); // Continue processing the request
});


const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully');

    await server.start();
    server.applyMiddleware({ app });

    const port = process.env.PORT || 4000;
    app.listen(port, async () => {
      console.log(`Server is running at http://localhost:${port}${server.graphqlPath}`);

    });
  } catch (error) {
    console.error('Error starting the server:', error);
  }

  process.on('SIGINT', async () => {
    console.log('Shutting down gracefully...');
    await sequelize.close();
    console.log('Database connection closed.');
    process.exit(0);
  });
};

startServer();
