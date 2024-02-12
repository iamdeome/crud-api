import { User } from './user';
import { v4 as uuidv4 } from 'uuid';

let users: User[] = [
  {
    id: uuidv4(),
    username: 'john_doe',
    age: 30,
    hobbies: ['reading', 'swimming']
  },
  {
    id: uuidv4(),
    username: 'jane_smith',
    age: 25,
    hobbies: ['painting', 'hiking']
  }
];

export function createUser(user: User): User {
  users.push(user);
  return user;
}

export function getUsers(): User[] {
  return users;
}

export function getUserById(id: string): User | undefined {
  return users.find(user => user.id === id);
}

export function updateUser(id: string, newData: Partial<User>): User | undefined {
  const userIndex = users.findIndex(user => user.id === id);
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...newData };
    return users[userIndex];
  }
  return undefined;
}

export function deleteUser(id: string): boolean {
  const initialLength = users.length;
  users = users.filter(user => user.id !== id);
  return users.length !== initialLength;
}
