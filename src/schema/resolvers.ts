import { db, User, Message } from '../data/database';

export const resolvers = {
    Query: {
        users: () => db.getAllUsers(),
        user: (_: any, {id}: {id: string}) => {
            const numericId = parseInt(id, 10);
            return db.getUserById(numericId)
        },

        messages: (_: any, {userId}: {userId: string}) => {
            console.log(typeof userId);
            const numericId = parseInt(userId, 10);
            return db.getMessagesForUser(numericId); 
        }
    },

    Mutation: {
        createUser: (_: any, {username, email}: {username: string, email: string}) => {
            return db.createUser(username, email);
        },

        sendMessage: (_: any, { content, senderId, receiverId }: { content: string, senderId: string, receiverId: string }) => {
            return db.createMessage(content, parseInt(senderId, 10), parseInt(receiverId, 10));
        }
    },

    User: {
        messages: (parent: User) => {
            console.log("Entered User.messages resolver");
            return db.getMessagesForUser(parent.id);
        },

        fullName: (parent: User) => {
            console.log('Warning: Using deprecated fullName field');
            return parent.username; 
        }
    },

    Message: {
        sender: (parent: Message) => {
            console.log("Entered Message.sender resolver");
            console.log("Message.sender typeof: " + typeof parent.senderId);
            return parent.senderId   
        },
        receiver: (parent: Message) =>{
            console.log("Entered Message.receiver resolver");
            return parent.receiverId
        } 
    }
}
