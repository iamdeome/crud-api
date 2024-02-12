import * as http from 'http';
import * as url from 'url';
import * as data from './data';

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
        // Create the new user if all required fields are present
        const newUser = data.createUser(user);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(newUser));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Invalid JSON');
      }
    });
  } 
  
  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found.');
  }
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
