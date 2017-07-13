/**
 * Created by Administrator on 2016/7/27.
 */
//var http = require('http');
//var opts = {
//    host:'www.baidu.com',
//    port:80,
//    path:'/',
//    method:'GET'
//};
//
//var req = http.request(opts,function(res){
//    console.log(res);
//    res.on('data',function(data){
//        console.log(data);
//    })
//});

//req.end();


var express = require('express');

var app = express();
app.get('/',function(req,res){
    res.render('index.jade',{pageTitle:'Jade Example',layout:false});
});


app.listen(8080);