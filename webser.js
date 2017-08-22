
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

    console.log(reqUrl);

    var pathName = libUrl.parse(reqUrl).pathname;
    if (libPath.extname(pathName) == "") {

        pathName += "/";
    }
    if (pathName.charAt(pathName.length - 1) == "/") {
        pathName += "index.html";
        //pathName += "photo.html";
        //pathName += "location_test1.html";
    }

    var params = [];
    params = libUrl.parse(req.url,true).query;
    //console.log(params.toString());

    var filePath = libPath.join("./personalSite", pathName);

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

            res.writeHead(404, {"Content-Type": "text/html"});
            res.end("<h1>404 Not Found</h1>");
        }
    });
}

var webSvr = libHttp.createServer(funWebSvr);



webSvr.on("error", function (error) {
    console.log(error);
});

webSvr.listen(3000, function () {

    console.log('[WebSvr][Start] running at http://127.0.0.1:3000/');

    console.timeEnd('[WebSvr][Start]');
}); 