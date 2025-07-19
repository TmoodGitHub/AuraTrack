import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import authMiddleware from './middleware/auth';

dotenv.config();

const app = express();

// Enable CORS with credentials for all routes
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// JWT middleware attaches req.user if a valid JWT is present
app.use(authMiddleware);

async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [
      ApolloServerPluginLandingPageLocalDefault({
        embed: true,
        includeCookies: true,
      }),
    ],
    context: ({ req, res }) => ({
      req,
      res,
      user: (req as any).user,
    }),
  });

  await server.start();

  server.applyMiddleware({
    // Cast to any to satisfy Apollo's typing
    app: app as any,
    path: '/graphql',
    cors: {
      origin: true,
      credentials: true,
    },
  });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}/graphql`);
  });
}

startApolloServer();
