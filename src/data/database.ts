import {v4 as uuidv4} from 'uuid';

export interface User {
    id: number;
    username: string;
    email: string;
    createdAt: Date;
}

export interface Message{
    id: number;
    content: string;
    senderId: number;
    receiverId: number;
    createdAt: Date;
}

export class Database {
    private users: User[] = [];
    private messages: Message[] = [];
    private nextUserId: number = 1; 
    private nextMessageId: number = 1; 

    getAllUsers(): User[] {
        return this.users;
    }

    getUserById(id: number): User | undefined { 
        return this.users.find(user => user.id === id);
    }

    createUser(username: string, email: string): User {
        const newUser: User = {
            id: this.nextUserId++, 
            username,
            email,
            createdAt: new Date()
        };
        this.users.push(newUser);
        return newUser;
    }

    getMessagesForUser(userId: number): Message[] { 
        return this.messages.filter(
          msg => msg.senderId === userId || msg.receiverId === userId
        );
    }

    createMessage(content: string, senderId: number, receiverId: number): Message { 
        const newMessage: Message = {
            id: this.nextMessageId++, 
            content,
            senderId,
            receiverId,
            createdAt: new Date()
        };
        this.messages.push(newMessage);
        return newMessage;
    }
}


export const db = new Database();

const user1 = db.createUser("alice", "alice@example.com");
const user2 = db.createUser("bob", "bob@example.com");
const message1 = db.createMessage("Hey Bob, how are you?", user1.id, user2.id);
const message2 = db.createMessage("I'm good, Alice! How about you?", user2.id, user1.id);
