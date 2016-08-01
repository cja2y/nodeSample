/**
 * Created by Administrator on 2016/8/1.
 */
var http_port = 8124;
var http = require('http');
var htutil = require('./myWeb/htutil');

var server = http.createServer(function(req,res){
    htutil.loadParams(req,res,undefined);
    if(req.requrl.pathname === '/'){
        require('./myWeb/homenode').get(req,res);
    }else if(req.requrl.pathname === ''){
        require('./myWeb/multnode').get(req,res);
    }else if(req.requrl.pathname === ''){

    }else if(req.requrl.pathname === ''){

    }else if(req.requrl.pathname === ''){

    }
});

server.listen(http_port);
//console.log('')
