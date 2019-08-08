var nconf = require('nconf');
var express = require('express');
var redis = require('redis');

var router = express.Router();

/* redis */
var router = express.Router({mergeParams: true});
var host = process.env.REDIS_PORT_6379_TCP_ADDR || nconf.get('redis-host'); // '10.0.75.1';
var port = process.env.REDIS_PORT_6379_TCP_PORT ||  nconf.get('redis-port') // 6379;
var clientRedis = redis.createClient(port, host);

/* GET home page test job redis. */
router.get('/', function(req, res, next) {
  clientRedis.incr('counter', function(err, result) {
    if (err) {
      return next(err);
    }
    res.render('index', { title: 'Express', counter: result });
  });
});

module.exports = router;
