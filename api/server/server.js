const express = require('express');
require('dotenv').config();

const server = express();
server.use(express.json());

server.get('/api/v1/public/get-user', (req, res) => {
  console.log('API server got request from APP server');
  res.json({ user: { email: 'team@builderbook.org' } });
});

server.listen(process.env.PORT_API, (err) => {
  if (err) {
    throw err;
  }
  console.log(`> Ready on ${process.env.URL_API}`);
});
