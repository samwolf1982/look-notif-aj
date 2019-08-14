// example key  user:3  user:{3 ид пользователя }
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
        clientRedis.lrange(userKey,0,-1, function (err, result) {
            if (err) {
                res.json({ isError: 1, errorMessage: err.toString(), userId: userId});
            }
            if(result){
               let  resultArray  =  result.map(function (element) {
                    let obj=JSON.parse(element);
                    //todo зделать валидацию
                    obj.isError=0;
                    obj.errorMessage='';
                    return obj;
               });
                // у пользователя есть сообщения
                res.json(resultArray);
                // для разработки запрет на удаление сообщение после чтения
                // if(0){clientRedis.del(userKey, function (err, result) {});}
                clientRedis.del(userKey, function (err, result) {});
            }else{
                res.json({isError: 0, errorMessage: '', userId: userId});
            }
        });
    } else {
        res.json({isError: 1, errorMessage: 'not found message for user', userId: userId});
    }
});
module.exports = router;
