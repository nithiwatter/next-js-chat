const express = require('express');
require('dotenv').config();
const api = require('./api/index');
const mongoose = require('mongoose');

mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('> DB connection successful'));

const server = express();
server.use(express.json());

api(server);

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
