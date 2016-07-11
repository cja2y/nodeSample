/**
 * Created by Administrator on 2016/7/11.
 */
var net = require('net');

var chatServer = net.createServer();
clientList = [];
chatServer.on('connection', function (client) {
    client.write('hi\n');
    client.name = client.remoteAddress + ':' + client.remotePort;
    client.write('hi' + client.name + '!\n');
    clientList.push(client);
    client.on('data', function (data) {
        broadcast(data, client)
    });
    client.on('end',function(){
        clientList.splice(clientList.indexOf(client),1)
    })
});
function broadcast(message, client) {
    for (var i = 0; i < clientList.length; i += 1) {
        if (client !== clientList[i]) {
            clientList[i].write(client.name + " says " + message);
            console.log(client.name + " says " + message);
        }
    }
}
chatServer.listen(9000, function () {
    console.log('[WebSvr][Start] running at localhost:9000/');
});