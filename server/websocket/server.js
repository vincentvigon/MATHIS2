/**
 *
 *  d'après http://codular.com/node-web-sockets
 *
 *  AVANT DE COMMENCER : charger les modules de nodejs.
 *  On suppose que vous avez déjà installer nodeJS (pour faire fonctionner typescript)
 *
 *  allez dans
 *  preference>Langage et frameworks > nodeJS et NPM
 *  puis "enable nodeJS core library"
 *
 *  Là, il y a une liste de packages installées, dans laquelle se trouve npm qui permet d'installer les autres (comme pip en python)
 *
 *
 *  Faite
 *       npm install http # facultatif
 *       npm install websocket
 *
 *
 */

var http = require('http');
var server = http.createServer(function(request, response) {});

/**ATTENTION : il ne faut pas qu'il y ai un autre server qui écoute sur le même port.
 * Les clients devront se connecter à ce server, sur ce port (cf fichier client.js) */
server.listen(1234, function() {
    console.log((new Date()) + ' Server is listening on port 1234');
});

var WebSocketServer = require('websocket').server;
wsServer = new WebSocketServer({
    httpServer: server
});



var count = 0;
var clients = {};

wsServer.on('request', function(r){
    // Code here to run on connection
    var connection = r.accept('echo-protocol', r.origin);
    // Specific id for this client & increment count
    var id = count++;
    // Store the connection method so we can loop through & contact all clients
    clients[id] = connection
    console.log((new Date()) + ' Connection accepted [' + id + ']');

    // Create event listener
    connection.on('message', function(message) {

        // The string message that was sent to us
        var msgString = message.utf8Data;

        // Loop through all clients
        for(var i in clients){
            // Send a message to the client with the message
            clients[i].sendUTF(msgString);
        }

    });

    connection.on('close', function(reasonCode, description) {
        delete clients[id];
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });


});






