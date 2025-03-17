import {gql} from 'apollo-server-express';

export const typeDefs = gql`
    type User {
        id: ID!
        username: String!
        email: String!
        createdAt: String!
        messages(first: Int, after: String): MessageConnection!
    }

    type Message {
        id: ID!
        content: String!
        sender: ID!
        receiver: ID!
        createdAt: String!
    }

    type PageInfo {
        hasNextPage: Boolean!
        endCursor: String
    }

    type MessageConnection {
        edges: [MessageEdge!]!
        pageInfo: PageInfo!
        totalCount: Int!
    }
    
    type MessageEdge {
        node: Message!
        cursor: String!
    }
        
    type Query {
        # User queries
        users: [User!]!
        user(id: ID!): User
        
        # Message queries with pagination
        messages(userId: ID!, first: Int, after: String): MessageConnection!
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