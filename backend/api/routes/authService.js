const express = require('express');
const router = express.Router();
const redis = require('../redis.js');

router.post('/authenticate', async (req, res) => {
  const params = req.body;
  let status, response;
  // validate params
  if (Object.keys(params).length == 1 && params.hasOwnProperty('token') && params.token.length > 0) {
    // retrieve from redis
    await redis
    .lrange('users', 0, -1)
    .then((reply) => {
      // validate email / password pair
      if (reply.some(({ token }) => token === params.token)) {
        status = 'OK';
      }
      else {
        status = 'ERROR';
        response = 'Invalid email or password.';
      }
      status = 'OK';
      response = JSON.stringify(reply);
    })
    .catch((err) => {
      status = 'ERROR';
      response = 'REDIS: ' + err;
    });
    // increase redis counter
    await redis.incr('calls');
  }
  else {
    status = 'ERROR';
    response = 'Invalid params.';
  }
  // send result
  res.send({
    status: status,
    date: new Date(),
    params: params,
    response: response,
  });
});

router.post('/create', async (req, res) => {
  const params = req.body;
  let status, response;
  // validate params
  if (Object.keys(params).length == 2 && params.hasOwnProperty('email') && params.email.length > 0 && params.hasOwnProperty('password') && params.password.length > 0) {
    // send to redis
    await redis
    .lpush('users', btoa(params.email.toLowerCase + ":" + params.password))
    .then((reply) => {
      status = 'OK';
    })
    .catch((err) => {
      status = 'ERROR';
      response = 'REDIS: ' + err;
    });
    // increase redis counter
    await redis.incr('calls');
  }
  else {
    status = 'ERROR';
    response = 'Invalid params.';
  }
  // send result
  res.send({
    status: status,
    date: new Date(),
    params: params,
    response: response,
  });
});

router.get('/', (req, res) => res.sendStatus(400).end());

module.exports = router;
