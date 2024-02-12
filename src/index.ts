import * as http from 'http';
import * as url from 'url';
import * as data from './data';

const server = http.createServer((req, res) => {
  const reqUrl = url.parse(req.url || '', true);
  const { pathname } = reqUrl;

  if (pathname === '/api/users' && req.method === 'GET') {
    const users = data.getUsers();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
