const router = require('express').Router();
const { client } = require('../db/client');
const { getParentById } = require('../db');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

/*******************Authorization Middleware*******************/
// bring in jwt
// bring in secret
// getParentById

// my token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IlNlYW4iLCJpYXQiOjE2ODI1MTk1MDR9.aDpHGn8UTofgVv6bEdHjJmQUaalu5o5agrpFRpr7myU

// Authroization middleware to verify a jwt is valid and attach a user to the req.
router.use(async (req, res, next) => {
  try {
    // console.log('these are my request headers: ', req.headers);
    const auth = req.header('Authorization');
    // console.log('auth is: ', auth);

    if (!auth) {
      next();
    } else {
      const [, token] = auth.split(' ');
      // console.log('this is token! Whoop whoop!', token);
      const parentObj = jwt.verify(token, JWT_SECRET);
      // console.log('this is parentObj', parentObj);

      const parent = await getParentById(parentObj.id);
      // console.log('this is parentObj', parent);
      if (parent) {
        req.parent = parent;
      }

      next();
    }
  } catch (error) {
    next(error);
  }
});

// test to see is the parent on the request
// the requireUser function in utils.js replaces this.
// router.use(async (req, res, next) => {
//   try {
//     if (req.parent) {
//       console.log('yay, it worked!', req.parent);
//     } else {
//       console.log('darn, it did not work!');
//     }
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// api/
router.get('/health', async (req, res, next) => {
  try {
    const uptime = process.uptime();

    const {
      rows: [dbConnection],
    } = await client.query(`
    SELECT NOW();
    `);

    const currentTime = new Date();

    const lastRestart = new Intl.DateTimeFormat('en', {
      timestyle: 'long',
      dateStyle: 'long',
      timeZone: 'America/New_York',
    }).format(currentTime - uptime * 1000);

    res.send({
      message: 'The api is healthy',
      uptime,
      dbConnection,
      currentTime,
      lastRestart,
    });
  } catch (error) {
    next(error);
  }
});

// Routers below
router.use('/pets', require('./pets'));
router.use('/parents', require('./parents'));
router.use('/tricks', require('./tricks'));

module.exports = router;
