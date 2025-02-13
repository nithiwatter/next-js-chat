const User = require('../models/User');
const Message = require('../models/Message');
const express = require('express');
const { validateUser } = require('../auth');

const router = express.Router();

router.get('/get-user', validateUser, async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).lean();
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
});

router.post('/get-user-by-slug', async (req, res, next) => {
  try {
    const { slug } = req.body;

    const user = await User.getUserBySlug({ slug });
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
});

router.post('/user/update-profile', async (req, res, next) => {
  try {
    const { name, userId, avatarUrl } = req.body;
    const updatedUser = await User.updateProfile({ name, userId, avatarUrl });
    res.status(200).json({ updatedUser });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
