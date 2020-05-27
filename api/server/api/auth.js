const express = require('express');
const {
  googleLogin,
  callbackGoogle,
  generateJWTToken,
  logOut,
} = require('../auth');

const router = express.Router();

router.get('/google', googleLogin);
router.get('/o-auth-callback', callbackGoogle, generateJWTToken);
router.get('/log-out', logOut);

module.exports = router;
