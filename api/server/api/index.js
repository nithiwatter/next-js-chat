const express = require('express');
const publicRouter = require('./public');

function handleError(err, req, res, next) {
  console.log(err.stack);
  res.status(400).json({ error: err.message || err.toString() });
}

module.exports = function api(server) {
  server.use('/api/v1/public', publicRouter, handleError);
};
