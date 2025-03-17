import {v4 as uuidv4} from 'uuid';

export interface User {
    id: string;
    username: string;
    email: string;
    createdAt: Date;
}

export interface Message{
    id: string;
    content: string;
    senderId: string;
    receiverId: string;
    createdAt: Date;
}

export class Database {
    private users: User[] = [];
    private messages: Message[] = [];

    getAllUsers(): User[] {
        return this.users;
    }

    getUserById(id: string): User | undefined {
        return this.users.find(user => user.id === id);
    }

    createUser(username: string, email: string): User {
        const newUser: User = {
            id: uuidv4(),
            username,
            email,
            createdAt: new Date()
          };
          this.users.push(newUser);
          return newUser;
    }

    getMessagesForUser(userId: string): Message[] {
        return this.messages.filter(
          msg => msg.senderId === userId || msg.receiverId === userId
        );
    }

    createMessage(content: string, senderId: string, receiverId: string): Message {
        const newMessage: Message = {
            id: uuidv4(),
            content,
            senderId,
            receiverId,
            createdAt: new Date()
        };
        this.messages.push(newMessage);
        return newMessage;
    }
}

//Adding some initial data
export const db = new Database();

const user1 = db.createUser("alice", "alice@example.com");
const user2 = db.createUser("bob", "bob@example.com");
db.createMessage("Hey Bob, how are you?", user1.id, user2.id);
db.createMessage("I'm good, Alice! How about you?", user2.id, user1.id);