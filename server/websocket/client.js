/**
 * Created by vigon on 15/02/2017.
 */


//'ws://MacBook-Pro-de-irma.local:9877


var ws = new WebSocket('ws://MacBook-Pro-de-irma.local:1234', 'echo-protocol');


ws.addEventListener("message", function(e) {
    // The data is simply the message that we're sending back
    var msg = e.data;

    // Append the message
    document.getElementById('chatlog').innerHTML += '<br>' + msg;
});

function sendMessage(){
    console.log('message envoyé')
    var message = document.getElementById('message').value;
    ws.send(message);
}