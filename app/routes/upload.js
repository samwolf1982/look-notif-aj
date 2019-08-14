// example key  user:3  user:{3 ид пользователя }
var nconf = require('nconf');
var express = require('express');
var redis = require('redis');

var router = express.Router({mergeParams: true});
var host = process.env.REDIS_PORT_6379_TCP_ADDR || nconf.get('redis-host'); // '10.0.75.1';
var port = process.env.REDIS_PORT_6379_TCP_PORT ||  nconf.get('redis-port') // 6379;
var clientRedis = redis.createClient(port, host);

var expiredCache=nconf.get('expired-cache');

/* GET noticeUpload page. dev mode*/
router.post('/', function (req, res, next) {
    let  runFunc = (req) => {
        let length = req.body.data.length;
        // проверка на массовые уведомления если тип уведомления 1(от всех) или про 8
        if( length>0 && ( req.body.data[0].type===1 ||  req.body.data[0].type===8 ) ){
            loadMass(req);
        }else{
           loadSimple(req);
        }
    };
   runFunc(req);
   res.json({isError:0,errorMessage:'',result:1,});
});


function loadSimple(req) {
    req.body.data.forEach( function (item, i, arr) {
        if(validate(item)){
            clientRedis.rpush(['user:'+item.uid, JSON.stringify(prepare(item))],function(err, reply) {
                clientRedis.EXPIRE('user:'+item.uid, expiredCache, function (err,reply) {
                    console.log(reply); //prints 1
                });
            });
        }
    });
}
function loadMass(req) {
    let user_list_id = req.body.data[0].user_list_id;
    let message = prepareMass(req.body.data[0])
    user_list_id.forEach( function (item, i, arr) {
            clientRedis.rpush(['user:'+item, JSON.stringify(prepare(message))],function(err, reply) {
                clientRedis.EXPIRE('user:'+item, expiredCache, function (err,reply) {
                    console.log(reply); //prints 1
                });
            });
        });
}

function validate(item){

    if (typeof(item.uid) === "undefined"){
        return  false;
    }
    return true
}

function prepareMass(obj){
    delete  obj.uid;
    delete  obj.user_list_id;
    return  obj;
}
function prepare(obj){
    delete  obj.uid;
    return  obj;
}
module.exports = router;
