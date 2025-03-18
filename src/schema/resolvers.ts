import { db, User, Message } from '../data/database';

const encodeCursor = (id: number) => Buffer.from(id.toString()).toString('base64');
const decodeCursor = (cursor: string) => parseInt(Buffer.from(cursor, 'base64').toString(), 10);

export const resolvers = {
    Query: {
        users : () => db.getAllUsers(),
        user: (_: any, {id}: {id: number}) => db.getUserById(id),
        messages: (_: any, {userId, first = 10, after}: {userId: number, first: number, after?: string}) => {
            const allMessages = db.getMessagesForUser(userId);
            let filteredMessages = [...allMessages];
            if (after) {
                const afterId = decodeCursor(after);
                const afterIndex = allMessages.findIndex(msg => msg.id === afterId);
                if (afterIndex >= 0) {
                  filteredMessages = allMessages.slice(afterIndex + 1);
                }
            }

            const limitedMessages = filteredMessages.slice(0, Math.min(first, 100));

            const edges = limitedMessages.map(message => ({
                node: message,
                cursor: encodeCursor(message.id)
              }));

            const hasNextPage = filteredMessages.length > first;
            
            return {
                edges,
                pageInfo: {
                  hasNextPage,
                  endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null
                },
                totalCount: allMessages.length
            };

        }
    },

    Mutation: {
        createUser: (_: any, {username, email}: {username: string, email: string}) =>{
            db.createUser(username, email);
        },

        sendMessage: (_: any, { content, senderId, receiverId }: { content: string, senderId: number, receiverId: number }) => {
            return db.createMessage(content, senderId, receiverId);
          }
      
    },

    User: {
        messages: (parent: User, { first = 10, after }: { first: number, after?: string }) => {
            const allMessages = db.getMessagesForUser(parent.id);
            let filteredMessages = [...allMessages];
            
            if (after) {
                const afterId = decodeCursor(after);
                const afterIndex = allMessages.findIndex(msg => msg.id === afterId);
                if (afterIndex >= 0) {
                    filteredMessages = allMessages.slice(afterIndex + 1);
                }
            }

            const limitedMessages = filteredMessages.slice(0, Math.min(first, 100));
    
            const edges = limitedMessages.map(message => ({
                node: message,
                cursor: encodeCursor(message.id)
            }));

            return {
                edges,
                pageInfo: {
                  hasNextPage: filteredMessages.length > first,
                  endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null
                },
                totalCount: allMessages.length
            };
        },

        fullName: (parent: User) => {
            console.log('Warning: Using deprecated fullName field');
            return parent.username; 
        }
    },

    Message: {
        sender: (parent: Message) => parent.senderId.toString(),
        receiver: (parent: Message) => parent.receiverId.toString()
    }
}