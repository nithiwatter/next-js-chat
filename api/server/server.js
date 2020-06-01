const express = require('express');
require('dotenv').config();
const api = require('./api/index');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { setUpWS } = require('./websocket');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

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
server.use(cookieParser());
server.use(morgan('dev'));
server.use(cors({ origin: process.env.URL_APP, credentials: true }));

api(server);

const httpServer = http.createServer(server);
setUpWS(httpServer);

httpServer.listen(process.env.PORT_API, (err) => {
  if (err) {
    throw err;
  }
  console.log(`> Ready on ${process.env.URL_API}`);
});
