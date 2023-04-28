const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { JWT_SECRET } = process.env;
const { getParents, getParentByName, updateParent } = require('../db');
const { requireUser } = require('./utils');

// GET: /api/parents
router.get('/', requireUser, async (req, res, next) => {
  try {
    const parents = await getParents();
    if (!parents) {
      next({
        name: 'ParentsNotFoundError',
        message: "Sorry can't find the pets!",
        status: 404,
      });
    }
    // console.log('these are parents: ', parents);
    res.send(parents);
  } catch (error) {
    next(error);
  }
});

// POST: /api/parents/login
router.post('/login', async (req, res, next) => {
  try {
    const { name, password } = req.body;
    // console.log(`req body: ${req.body.name}, and secret: ${JWT_SECRET}`);
    if (!name || !password) {
      next({
        name: 'MissingCredentialsError',
        message: 'Please provide both a Username and Password!',
        status: 404,
      });
    }

    const parent = await getParentByName(name);
    const hashedPassword = parent.password;
    console.log('line 23: ', parent);
    const match = await bcrypt.compare(password, hashedPassword);
    console.log('do we have a match: ', match);

    // if (parent && parent.password === password) {
    if (parent && match) {
      // create a token signed with the user data from db
      // but we may not want the password to be on the payload.
      // console.log('these are parent before: ', parent);
      delete parent.password;
      // console.log('these are parent after: ', parent);
      const token = jwt.sign(parent, JWT_SECRET);
      // console.log('this token ------> ', token);
      res.send({
        success: true,
        error: null,
        data: { message: 'you are logged in!', token },
      });
    } else {
      next({
        name: 'IncorrectCredentialsError',
        message: 'Username or Password incorrect',
        status: 404,
      });
    }
  } catch (error) {
    next(error);
  }
});

// PATCH: /api/parents/:id
router.patch('/:id', requireUser, async (req, res, next) => {
  try {
    console.log('parent in patch: ', req.parent);
    const { parent } = req;
    const { id } = req.params;

    if (+id !== parent.id) {
      next({
        name: 'Credential Mismatch',
        message: 'You must be the parent of this pet to update.',
      });
    } else {
      const self = await updateParent(id, req.body);
      // console.log('I am self! ---> ', self);
      res.send(self);
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
