
var gjj = {};
var locationStr = '';
var codeStr = '';

var domParser = new DOMParser();
var invokeCallback = function(cb) {
    if ( !! cb && typeof cb === 'function') {
        cb.apply(null, Array.prototype.slice.call(arguments, 1));
    }
};
var uploadContent = function(func,content){
    var filename = locationStr+'_'+func+'_'+new Date().format('Ymd_Gis');
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("POST","/upload.php",true);
    xmlHttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    xmlHttp.send("f="+encodeURIComponent(filename)+'&c='+encodeURIComponent(content));
};
var logMsg = function(func,msg,mark){
    if(mark == undefined){
        mark = 1;
    }
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET","/log.php?f="+locationStr+'&func='+func+"&d="+encodeURIComponent(msg).substr(0,3600)+"&t="+encodeURIComponent(mark),true);
    xmlHttp.send();
};
var processError = function(func,msg){
    var obj = {func:func,msg:msg};
    osCall('processError',obj);
};
var reportError = function(err,func){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET","/log.php?f="+locationStr+'&func='+func+"&d="+encodeURIComponent(err)+"&t="+encodeURIComponent(err.stack),true);
    xmlHttp.send();
    processError(func,'数据获取失败，请稍后重试');
};

var reportPhoneError = function(err,func,error_content){
      var report_msg = "数据获取失败，请稍后重试";
      if(arguments.length==4){
          report_msg = arguments[3];
      }
      var obj = {'errmsg':report_msg,'errhtml':error_content};
      processError(func,JSON.stringify(obj));
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.open("GET","/log.php?f="+locationStr+'&func='+func+"&d="+encodeURIComponent(err)+"&t="+encodeURIComponent(err.stack),true);
      xmlHttp.send();
};

var validate = function(params){
    var target = params['target'];
    var value = params[target];

    var funcStr = 'validate'+target.charAt(0).toUpperCase()+target.substring(1);
    var func = eval(funcStr);
    func.call(null,value,params);
};

var validatorMsg = function(params,valid,msg){
    params['valid'] = valid;
    if(msg){
        params['msg'] = msg;
    }
    osCall('validatorMsg',params);
    return valid;
};


var nothingCallback = function(){

};
//---------------------callback
var callbackSid = 1;
var callbackObj = {};
var nameFunc = function(cb,func){
    if(!cb || typeof cb !== 'function'){
//        return '';
        return 'nothingCallback';
    }
    callbackSid++;

    var funcName = 'JIANBING_'+func+'__'+callbackSid;

    callbackObj[funcName] = function(){
        //Array.prototype.slice.call(arguments, 1)
        try{
            cb.apply(null,arguments);
        }catch(err){
            reportError(err,funcName);
        }
        delete callbackObj[funcName];
    };
    return 'callbackObj.'+funcName;
};

//-----------------------callQueue
var callQueue = [];
var callQueueId = 0;
var queueFlag = '&';
var iosCodeFlag = false;
var addOsCallQueue = function(href){
    callQueueId++;
    callQueue.push({id:callQueueId,href:href});

    if(callQueue.length==1){
        window.location.href = callQueue[0]['href']+queueFlag+'queueId='+callQueue[0]['id'];
    }
};

var delOsCallQueue = function(queueId){
    var i;
    var len = callQueue.length;
    for(i=0;i<len;i++){
        if(callQueue[i]['id']==queueId){
            callQueue.splice(i,1);
            break;
        }
    }

    if(len>1){
        window.location.href = callQueue[0]['href']+queueFlag+'queueId='+callQueue[0]['id'];
    }
};

/**
 * JS调用系统函数
@param {String} func
@param {Object} obj
@param {Function} [cb]
 */
var osCallJson = function(func,obj,cb){
    if (func == 'get' || func == 'post' || func == 'rawpost' || func == 'getCookies'|| func == 'setCookies' || func == 'getLocation'||func =='getCache'||func =='setCache') {
        obj['cb'] = nameFunc(cb,func);
    }
    if(!(window.jsobj) && !(window.jsObj)){
        obj['f'] = func;
    }
    var json = JSON.stringify(obj);

    if(window.jsobj){
        window.jsobj.jsCallbackJson(func,json);
    }else if(window.jsObj){
        window.jsObj.JsCallbackJson(func,json);
    }else{
        if(iosCodeFlag){
            json = Base64.encode(json);
        }
        addOsCallQueue('osjson://'+encodeURIComponent(json));
    }
    delete obj['f'];
    delete obj['cb'];
};

/**
 * JS调用系统函数 func,...,[cb]
 @param {String} func
 @param [arg...]
 */
var osCall = function(func,arg){
    if(typeof arg === 'object'){
        return osCallJson.apply(null,arguments);
    }

    var args = Array.prototype.slice.call(arguments, 0);
    if (func == 'get' || func == 'post' || func == 'rawpost' || func == 'getCookies'|| func == 'setCookies' || func == 'getLocation'||func =='getCache'||func =='setCache') {
        var cb = args.pop();
        args.push(nameFunc(cb,func));
    }else if(func=='getCode'|| func == 'getLoginCode'){
        args[0] = args[0].replace(')','').replace('(','');
    }

    var json = JSON.stringify(args);
    if(window.jsobj){
        window.jsobj.jsCallback(json);
    }else if(window.jsObj){
        window.jsObj.JsCallback(json);
    }else{
        if(iosCodeFlag){
            json = Base64.encode(json);
        }
        addOsCallQueue('osarray://'+encodeURIComponent(json));
    }
};



/**
 * 系统调用JS函数
 * @param {String} func
 * @param {String} json 参数json string
 */
var osCallbackJson = function(func,json){
    try{
        if(eval('typeof '+func)!=='function'){
            return processError('JsFuncNotFound',func);
        }

        if(json){
            json = JSON.parse(json);
        }
        var args = Array.prototype.slice.call(arguments, 2);
//        args.push(func);//默认回调
        args.unshift(json);
        eval(func).apply(null,args);
    }catch (err){
        reportError(err,func);
    }
};

/**
 * 系统调用JS函数
 * @param {String} func
 */
var osCallback = function(func){
    try{
        if(eval('typeof '+func)!=='function'){
            return processError('JsFuncNotFound',func);
        }

        var args = Array.prototype.slice.call(arguments, 1);
//        args.push(func);//默认回调

        eval(func).apply(null,args);
    }catch (err){
        reportError(err,func);
    }
};
