// example key  user:3  user:{3 ид пользователя }er:3
var nconf = require('nconf');
var express = require('express');
var redis = require('redis');

var router = express.Router({mergeParams: true});
var host = process.env.REDIS_PORT_6379_TCP_ADDR || nconf.get('redis-host'); // '10.0.75.1';
var port = process.env.REDIS_PORT_6379_TCP_PORT ||  nconf.get('redis-port') // 6379;
var clientRedis = redis.createClient(port, host);

/* GET noticeCount page. */
router.get('/', function (req, res, next) {
    let userId = req.params.userId;
    if (userId) {
        let userKey = 'user:' + userId;
        clientRedis.llen(userKey, function(err, result) {
            if (err) {res.json({amount: 0, isError: 1, errorMessage: err.toString(), userId: userId});}
            if(result){
                res.json({amount: Number(result), isError: 0, errorMessage: '', userId: userId});
            }else{
                res.json({amount: 0, isError: 0, errorMessage: '', userId: userId});
            }
        });
    } else {
        res.json({amount: 0, isError: 1, errorMessage: 'not found user', userId: userId});
    }
});


module.exports = router;
