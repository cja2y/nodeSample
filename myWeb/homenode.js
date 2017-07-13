/**
 * Created by Administrator on 2016/8/1.
 */
var htutil = require('./htutil');
exports.get = function(req,res){
    res.writeHead(200,{
        'Content-Type':'text/html'
    })

    res.end(
        htutil.page("数学函数计算",
        htutil.navbar(),
        "<p>数学函数计算</p>"
    )
    );

}