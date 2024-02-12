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
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
