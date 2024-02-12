import { createUser, getUserById, getUsers, updateUser } from './data';

describe('API Tests', () => {
  test('Create a new object by createUser function', () => {
    const userData = {
      username: 'JohnDoe',
      age: 30,
      hobbies: ['Reading', 'Gaming']
    };

    const newUser = createUser(userData);
    expect(newUser).toHaveProperty('id');
    expect(newUser).toMatchObject(userData);
  });

  test('Get a created record by its id with getUserById function', () => {
    const users = getUsers();
    const userId = users[0].id;
    const user = getUserById(userId);
    expect(user).toBeDefined();
  });

  test('Update a user record with updateUser function', () => {
    const users = getUsers();
    const userId = users[0].id;

    const updatedUserData = {
      username: 'UpdatedUsername',
      age: 35,
      hobbies: ['NewHobby']
    };

    const updatedUser = updateUser(userId, updatedUserData);
    expect(updatedUser).toBeDefined();
    expect(updatedUser).toMatchObject(updatedUserData);
  });
});
