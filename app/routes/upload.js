// example key  user:3  user:{3 ид пользователя }
var nconf = require('nconf');
var express = require('express');
var redis = require('redis');

var router = express.Router({mergeParams: true});
var host = process.env.REDIS_PORT_6379_TCP_ADDR || nconf.get('redis-host'); // '10.0.75.1';
var port = process.env.REDIS_PORT_6379_TCP_PORT ||  nconf.get('redis-port') // 6379;
var clientRedis = redis.createClient(port, host);

/* GET noticeUpload page. dev mode*/
router.post('/', function (req, res, next) {

    let  runFunc = (req) => {
        req.body.data.forEach( function (item, i, arr) {
            if(validate(item)){
                clientRedis.rpush(['user:'+item.uid, JSON.stringify(prepare(item))], function(err, reply) {
                    console.log(reply); //prints 2
                    if (err) {res.json({isError:1,errorMessage: err.toString()});}
                });
            }
        });
    };
    runFunc(req);
    res.json({isError:0,errorMessage:'',result:1,});
});



/* GET noticeUpload page. only test dev mode*/
router.get('/', function (req, res, next) {
    let   obj = {"id": 15628137, "date": "08-24-2019 23:12:39", "type": 5, "title": "User2", "message": "mollit nostrud ut anim", "image": "/upload/image.png", "url": "http://some_url"};
    // clientRedis.rpush(['user:3', ob.toString(),ob.toString()], function(err, reply) {
    clientRedis.rpush(['user:3',JSON.stringify(obj)], function(err, reply) {
        console.log(reply); //prints 2
        clientRedis.llen('user:3', function(err, reply) {
            res.json({isError:0,result:reply,count:reply});
        });
    });
});



function validate(item){

    if (typeof(item.uid) === "undefined"){
        return  false;
    }
    return true
}

function prepare(el){
    let   obj=el;
    delete  obj.uid;
    return  obj;
}

module.exports = router;
