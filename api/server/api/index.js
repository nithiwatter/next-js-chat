const publicRouter = require('./public');
const teamMemberRouter = require('./team-member');

function handleError(err, req, res, next) {
  console.log(err.stack);
  res.status(400).json({ error: err.message || err.toString() });
}

module.exports = function api(server) {
  server.use('/api/v1/public', publicRouter, handleError);
  server.use('/api/v1/team-member', teamMemberRouter, handleError);
};
