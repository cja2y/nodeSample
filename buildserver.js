/**
 * Created by caoyinghang on 2017/8/28.
 */
console.time('[WebSvr][Start]');
var libHttp = require('http');
var libUrl = require('url');
var libFs = require("fs");
var libPath = require("path");
var fs= require("fs");

var funGetContentType = function (filePath) {
    var contentType = "";

    var ext = libPath.extname(filePath);
    switch (ext) {
        case ".html":
            contentType = "text/html";
            break;
        case ".js":
            contentType = "text/javascript";
            break;
        case ".css":
            contentType = "text/css";
            break;
        case ".gif":
            contentType = "image/gif";
            break;
        case ".jpg":
            contentType = "image/jpeg";
            break;
        case ".png":
            contentType = "image/png";
            break;
        case ".ico":
            contentType = "image/icon";
            break;
        default:
            contentType = "application/octet-stream";
    }
    return contentType;
}

var funWebSvr = function (req, res) {
    var reqUrl = req.url;
    //console.log(reqUrl);
    req.on('data',function (data) {
        console.log(decodeURIComponent(data));
    });
    var pathName = libUrl.parse(reqUrl).pathname;
    if (libPath.extname(pathName) == "") {

        pathName += "/";
    }
    if (pathName.charAt(pathName.length - 1) == "/") {
        pathName += "index.html";
    }

    var params = [];
    params = libUrl.parse(req.url,true).query;
    //console.log(params.toString());

    var filePath = libPath.join("./gjjbuild", pathName);

    fs.exists(filePath, function (exists) {
        if (exists) {

                res.writeHead(200, {"Content-Type": funGetContentType(filePath)});

                var stream = libFs.createReadStream(filePath, {flags: "r", encoding: null});

                stream.on("error", function () {
                    res.writeHead(404);
                    res.end("<h1>404 Read Error</h1>");
                });

                stream.pipe(res);

        }
        else {
            if(reqUrl.indexOf("do_it")>=0){
                shBuild(res,"./gjjbuild/jobsuccess.html");
                //res.writeHead
                return;
            }
            if(reqUrl.indexOf("do_it_one")>=0){
                shBuild(res,"./gjjbuild/jobsuccess.html");
                //res.writeHead
                return;
            }

            res.writeHead(404, {"Content-Type": "text/html"});
            res.end("<h1>404 Not Found</h1>");
        }
    });

};

var webSvr = libHttp.createServer(funWebSvr);
var reqSvr = libHttp.createServer(function (req,res) {
    req.on("data",function (data) {
        console.log(decodeURIComponent(data));
    })
});
webSvr.on("error", function (error) {
    console.log(error);
});
webSvr.listen(3001, function () {
    //shBuild();
    console.log('[WebSvr][Start] running at http://127.0.0.1:3001/');

    console.timeEnd('[WebSvr][Start]');
});

var callfile = require('child_process');
var shBuild = function (res,filePath) {
    console.log('first here');
    callfile.execFile('./gjjbuild/buildScript.sh',[],null,function (err,stdout,stderr) {
        console.log('in here'+stdout);
        console.log('build err'+err+'**'+stderr);
        if(stdout.indexOf('build over')){
            res.writeHead(200, {"Content-Type": funGetContentType(filePath)});

            var stream = libFs.createReadStream(filePath, {flags: "r", encoding: null});

            stream.on("error", function () {
                res.writeHead(404);
                res.end("<h1>404 Read Error</h1>");
            });

            stream.pipe(res);
        }
        //callback(err,stdout,stderr);
    });
    //callfile.execFile('./gjjbuild/buildScript.sh');
    //callfile.exec("echo 'hello'");

};