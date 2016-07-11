/**
 * Created by Panda on 14-6-23.
 */
var getPage = function () {
    var cfg = {};

    cfg['page'] = [];
    cfg['page'].push({type: 'ID'});
    cfg['page'].push({type: 'password'});
    cfg['page'].push({
        type: 'phone_code',
        label: '短信验证码',
        hint: '短信验证码区分大小写',
        needList: ['ID', 'password'],
        cd: '120',
        api: 'getPhoneCode'
    });
//    cfg['page'].push({type: 'code'});
    osCall('getPage', cfg);
};

var doAction = function (params) {
    if (params.api == 'getPhoneCode') {
        getPhoneCode(params.password, params.ID)
    }
};

var own_headers = {
    'Content-Type': 'application/json'
};

var getPhoneCode = function (password, ID) {
    var url = 'http://www.qzgjj.com/Index/UserLogin?rand=' + Math.random();
    var argstr = '{ "l_loginName":"' + ID + '","l_password":"' + password + '"}';

    osCall('rawpost', url, argstr, 'utf8', JSON.stringify(own_headers), function (content) {
        if (content.substring(0, 5) == '51GJJ') {//status
            if (content.substring(5, 8) != '200') {//status not is 200
                return processError('winForm', content.substring(5, 8));
            } else {
                content = content.replace(/51GJJ200/, '');
            }
        }
        if (content == '1') {
            url = 'http://www.qzgjj.com/PAFundQuery/Index';
            osCall('get', url, 'utf8', function (content) {
                if (content.substring(0, 5) == '51GJJ') {//status
                    if (content.substring(5, 8) != '200') {//status not is 200
                        return processError('winForm', content.substring(5, 8));
                    } else {
                        content = content.replace(/51GJJ200/, '');
                    }
                }
                url = "http://www.qzgjj.com/Index/R_SendCode";
                var webParams = '{}';
                osCall('rawpost', url, webParams, 'utf8', JSON.stringify(own_headers), function (content) {

                    uploadContent('getPhoneCode', content);
                    if (content.substring(0, 5) == '51GJJ') {//status
                        if (content.substring(5, 8) != '200') {//status not is 200
                            return processError('winForm', content.substring(5, 8));
                        } else {
                            content = content.replace(/51GJJ200/, '');
                        }
                    }
//                    osCall('getCookies', function (cookieData) {
//                        var __RequestVerificationToken_Lw__ = cookieData['__RequestVerificationToken_Lw__'];
//                        var gjjaccname = cookieData['ASP.NET_SessionId'];

                    if (content == '1') {
                        osCall('doAction', '短信验证码已发送至您的手机');
                    } else if (content == '-99') {
                        osCall('doAction', '登录超时，请重新登录');
                    } else {
                        osCall('doAction', content);
                    }
                });
//                });
            });
        } else if (content == '-2') {
            osCall('doAction', '抱歉，您的账号已被冻结或不存在！');
        } else if (content == '-1') {
            osCall('doAction', '抱歉，身份证号或密码错误');
        } else {
            osCall('doAction', content);
        }
    });
};


//var getCode = function (refresh) {
//    var url = 'http://www.qzgjj.com/Index/GetCheckCode?type=GJJCX_post&r=' + Math.random();
//    osCall('getCode', url);
//};

var hiddenNumber, hiddenName;
var getGjjData = function (params) {
    var func = 'getGjjData';
    var ID = params['ID'];
    if (typeof params['password'] == 'undefined') {
        return processError(func, '公积金中心已改版，请删除账户后重新添加！');
    }

    var password = params['password'];
    var phone_code = params['phone_code'];
//    var code = params['code'];

    var url = 'http://www.qzgjj.com/Index/UserLogin?rand=' + Math.random();
    var argstr = '{ "l_loginName":"' + ID + '","l_password":"' + password + '"}';

    osCall('rawpost', url, argstr, 'utf8', JSON.stringify(own_headers), function (content) {
        if (content.substring(0, 5) == '51GJJ') {//status
            if (content.substring(5, 8) != '200') {//status not is 200
                return processError('winForm', content.substring(5, 8));
            } else {
                content = content.replace(/51GJJ200/, '');
            }
        }
        if (content != 1) {
            if (content == '-2') {
                return processError(func, '抱歉，您的账号已被冻结或不存在！');
            } else if (content == '-1') {
                return processError(func, '抱歉，身份证号或密码错误');
            } else {
                return processError(func, content);
            }
        }

        var url = 'http://www.qzgjj.com/PAFundQuery/Index';
        osCall('get', url, 'utf8', function (content) {
            if (content.substring(0, 5) == '51GJJ') {//status
                if (content.substring(5, 8) != '200') {//status not is 200
                    return processError('winForm', content.substring(5, 8));
                } else {
                    content = content.replace(/51GJJ200/, '');
                }
            }
            var doc = domParser.parseFromString(content, "text/html");
            var __RequestVerificationToken = doc.getElementsByName('__RequestVerificationToken')[0].value;

            url = 'http://www.qzgjj.com/PAFundQuery';
            var webParams = {};
            webParams['__RequestVerificationToken'] = __RequestVerificationToken;
            webParams['cmd'] = '';
            webParams['ErrorMessage'] = '';
            webParams['hiddenQueryType'] = '1';
            webParams['hiddenAction'] = '';
            webParams['IDCardNo'] = '';
            webParams['Tb_CheckCode'] = '';
            webParams['Tb_MsgVCode'] = phone_code;
            webParams['QueryType_Select'] = '2';

            own_headers = {
                'Content-Type': 'application/x-www-form-urlencoded'
            };
            osCall('post', url, JSON.stringify(webParams), 'utf8', JSON.stringify(own_headers), function (content) {
                uploadContent('gjj' + ID, content);
                if (content.substring(0, 5) == '51GJJ') {//status
                    if (content.substring(5, 8) != '200') {//status not is 200
                        return processError('winForm', content.substring(5, 8));
                    } else {
                        content = content.replace(/51GJJ200/, '');
                    }
                }
                doc = domParser.parseFromString(content, "text/html");
                var ErrorMessage = doc.getElementById("ErrorMessage");
                if (ErrorMessage != null) {
                    return processError(func, doc.getElementById("ErrorMessage").value);
                }
                var result = doc.evaluate("//table[@id='grid_id']/tbody/tr/td", doc, null, 7);

                gjj['customer_id'] = result.snapshotItem(2).textContent.trim();
                gjj['ID'] = ID;
                gjj['name'] = result.snapshotItem(0).textContent.trim().replace(/[^\u4e00-\u9fa5a-zA-Z\*\．\.]+/g, '');
                gjj['state'] = result.snapshotItem(3).textContent.trim();
                gjj['company'] = result.snapshotItem(8).textContent.trim();
                gjj['base'] = result.snapshotItem(4).textContent.trim();
                gjj['balance'] = result.snapshotItem(5).textContent.trim();
                gjj['initial_date'] = result.snapshotItem(9).textContent.trim();

                result = doc.evaluate("//table[@id='grid_id']/tbody/tr/td/a", doc, null, 7);
                hiddenNumber = result.snapshotItem(0).getAttribute('href').match(/'(.*)',/)[1];
                hiddenName = result.snapshotItem(0).getAttribute('href').match(/,'(.*)'/)[1];

                osCall('getGjjData', gjj);
            });
        });
    });
};


var getGjjDetails = function (params) {
    var start_date = params['start_date'];
    var details = [];
    gjj['record_date'] = '00000000';
    var url = "http://www.qzgjj.com/PAFundQuery/PersonAccountDetails?c=1";
    var webParams = {};
    webParams['hiddenNumber'] = hiddenNumber;
    webParams['hiddenName'] = hiddenName;
    osCall('post', url, JSON.stringify(webParams), 'utf8', JSON.stringify(own_headers), function (content) {
        uploadContent('detail' + gjj['ID'], content);
        if (content.substring(0, 5) == '51GJJ') {//status
            if (content.substring(5, 8) != '200') {//status not is 200
                return processError('winForm', content.substring(5, 8));
            } else {
                content = content.replace(/51GJJ200/, '');
            }
        }
        var doc = domParser.parseFromString(content, "text/html");
        var getData = function (content) {
            var doc = domParser.parseFromString(content, "text/html");
            var result = doc.evaluate("//table[@id='grid_id']/tbody/tr", doc, null, 7);

            var detail;
            var i;
            var len = result.snapshotLength;
            var item;
            for (i = 0; i <= len - 1; i++) {
                detail = [];
                item = result.snapshotItem(i);
                detail[2] = item.children[1].textContent.trim();
                if (!/\d/.test(detail[2])) {
                    continue;
                }
                if (gjj['record_date'] <= detail[2]) {
                    gjj['record_date'] = detail[2];
                }
                detail[0] = '';
                detail[1] = '';
                if (/汇缴/.test(item.children[2].textContent.trim())) {
                    detail[3] = '汇缴';
                    detail[4] = detail[2].substring(0, 2) + item.children[2].textContent.trim().match(/\d+/)[0];
                } else {
                    detail[3] = item.children[2].textContent.trim();
                    detail[4] = '';
                }
                if (item.children[3].textContent.trim() != 0) {
                    detail[5] = item.children[3].textContent.trim();
                } else {
                    detail[5] = item.children[4].textContent.trim();
                }
                detail[6] = item.children[5].textContent.trim();
                details.push(detail);
            }
        };

        getData(content);

        var page = Math.ceil(doc.getElementsByClassName('divCount')[0].innerHTML.match(/\d+/)[0] / 10);
        var j = 2;
        var detailfunc = function () {
            if (j <= page) {
                var url = "http://www.qzgjj.com/PAFundQuery/PersonAccountDetails?c=1&pageIndex=" + j;
                osCall('get', url, 'utf8', JSON.stringify(own_headers), function (content) {
                    if (content.substring(0, 5) == '51GJJ') {//status
                        if (content.substring(5, 8) != '200') {//status not is 200
                            return processError('winForm', content.substring(5, 8));
                        } else {
                            content = content.replace(/51GJJ200/, '');
                        }
                    }
                    getData(content);
                    j++;
                    detailfunc();
                });
            } else {
                var obj = {};
                obj['gjj'] = gjj;
                obj['details'] = details;
                osCall('getGjjDetails', obj);
            }
        };
        detailfunc();
    });
};

