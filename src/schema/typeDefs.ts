import {gql} from 'apollo-server-express';

export const typeDefs = gql`
    type User {
        id: ID!
        username: String!
        email: String!
        createdAt: String!
        messages: [Message!]! 
    }

    type Message {
        id: ID!
        content: String!
        sender: ID!
        receiver: ID!
        createdAt: String!
    }

    type Query {
        # User queries
        users: [User!]!
        user(id: ID!): User
        
        # Message queries without pagination
        messages(userId: ID!): [Message!]!
    }

    type Mutation {
        # User mutations
        createUser(username: String!, email: String!): User!
        
        # Message mutations
        sendMessage(content: String!, senderId: ID!, receiverId: ID!): Message!
    }

    extend type User {
        fullName: String @deprecated(reason: "Use username instead")
    }

    extend type Message {
        isRead: Boolean
        readAt: String
    }
`;
