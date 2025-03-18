import { db, User, Message } from '../data/database';

export const resolvers = {
    Query: {
        users: () => db.getAllUsers(),
        user: (_: any, {id}: {id: number}) => db.getUserById(id),
        messages: (_: any, {userId}: {userId: number}) => {
            return db.getMessagesForUser(userId); 
        }
    },

    Mutation: {
        createUser: (_: any, {username, email}: {username: string, email: string}) => {
            return db.createUser(username, email);
        },

        sendMessage: (_: any, { content, senderId, receiverId }: { content: string, senderId: number, receiverId: number }) => {
            return db.createMessage(content, senderId, receiverId);
        }
    },

    User: {
        messages: (parent: User) => {
            return db.getMessagesForUser(parent.id);
        },

        fullName: (parent: User) => {
            console.log('Warning: Using deprecated fullName field');
            return parent.username; 
        }
    },

    Message: {
        sender: (parent: Message) => db.getUserById(parent.senderId),
        receiver: (parent: Message) => db.getUserById(parent.receiverId)
    }
}
