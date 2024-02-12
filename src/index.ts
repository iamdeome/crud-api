import * as http from 'http';
import * as url from 'url';
import * as data from './data';
import { v4 as uuidv4, validate as validate } from 'uuid';

const server = http.createServer((req, res) => {
  const reqUrl = url.parse(req.url || '', true);
  const { pathname } = reqUrl;

  //handle GET to see all users
  if (pathname === '/api/users' && req.method === 'GET') {
    const users = data.getUsers();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
    //handle GET request to open the user by ID
  } else if (pathname?.startsWith('/api/users/') && req.method === 'GET') {
    const userId = pathname.split('/')[3];
    const user = data.getUserById(userId);
    if (user) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(user));
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('User not found');
    }
  } // Handle POST request for creating a new user
  else if (pathname === '/api/users' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const user = JSON.parse(body);
        // Check if required fields are present in the request body
        if (!user.username || !user.age || !user.hobbies) {
          res.writeHead(400, { 'Content-Type': 'text/plain' });
          res.end('Required fields missing: username, age, and hobbies');
          return;
        }
        const userID = uuidv4();
        // Create the new user if all required fields are present
        const newUser = { ...user, id: userID }
        data.createUser(newUser);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newUser));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Invalid JSON');
      }
    });
  }
  // Handle PUT request for updating a specific user by ID
  else if (pathname?.startsWith('/api/users/') && req.method === 'PUT') {
    const userId = pathname.split('/')[3];
    if (!validate(userId)) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Invalid userId');
      return;
    }
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const newData = JSON.parse(body);
        const updatedUser = data.updateUser(userId, newData);
        if (updatedUser) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(updatedUser));
        } else {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('User not found');
        }
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Invalid JSON');
      }
    });
  } // Handle PUT request for updating a specific user by ID
  else if (pathname?.startsWith('/api/users/') && req.method === 'DELETE') {
    const userId = pathname.split('/')[3];
    if (!validate(userId)) {
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.end('Invalid userId');
      return;
    }
    const success = data.deleteUser(userId);
    if (success) {
      res.writeHead(204);
      res.end();
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('User not found');
    }
  }
  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found. in human human-friendly message');
  }
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
