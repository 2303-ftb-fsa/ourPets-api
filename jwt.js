require('dotenv').config();
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

// console.log(process.env.JWT_SECRET);
console.log(JWT_SECRET);
// console.log(jwt);

const SECRET = "please don't do this in real life"; //Never store you secret in a file on a server. It should be hidden.

// console.log('this is our secret: ', SECRET);

const user = {
  id: 42,
  name: 'Jackie Robinson',
  sport: 'Baseball',
  position: 'Short Stop',
};

// console.log('this is our player: ', user);

// const token = jwt.sign({ foo: 'bar' }, 'shhhhh');
// const token = jwt.sign(user, SECRET, { expiresIn: '1m' });
const token = jwt.sign(user, JWT_SECRET, { expiresIn: '1m' });

// console.log('this is token: ', token);

// const decodedFromToken = jwt.verify(
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDIsIm5hbWUiOiJKYWNraWUgUm9iaW5zb24iLCJzcG9ydCI6IkJhc2ViYWxsIiwicG9zaXRpb24iOiJTaG9ydCBTdG9wIiwiaWF0IjoxNjgyMzQ1MzgzLCJleHAiOjE2ODIzNDU0NDN9.cDIFoBMwHp_WYntaH-RIr7eFr2wa7_yFKXAFc06Pn5Y',
//   SECRET
// );
const decodedFromToken = jwt.verify(token, JWT_SECRET);
// const decodedFromToken = jwt.verify(token, SECRET);
// const decodedFromToken = jwt.verify(token, 'SECReT');
console.log(decodedFromToken);
