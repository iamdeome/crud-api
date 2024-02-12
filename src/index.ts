import * as http from 'http';

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello, World!\n');
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});