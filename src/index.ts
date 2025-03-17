import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import http from 'http';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { typeDefs } from './schema/typeDefs';
import { resolvers } from './schema/resolvers';
import { RateLimiter } from './middleware/rateLimit';


async function startApolloServer(){
    const app = express();
    const httpServer = http.createServer(app);

    const rateLimiter = new RateLimiter();

    app.use(rateLimiter.middleware());

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
        context: ({ req }) => {
            // Here you could add authentication logic
            return { 
              user: null, // Add authenticated user here if needed
            };
        },
        formatError: (error) => {
            console.error('GraphQL Error:', error);
            // Customize error responses if needed
            return error;
        }
    });

    await server.start();

    server.applyMiddleware({ app: app as any });

    const PORT = process.env.PORT || 4000;
    await new Promise<void>(resolve => 
        httpServer.listen({ port: PORT }, resolve)
    );

    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
}


startApolloServer().catch(error => {
    console.error('Failed to start server:', error);
});