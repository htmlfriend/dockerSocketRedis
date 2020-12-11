const http = require('http');
const WebSocketServer = require('websocket').server;
let connection = null;

const httpserver = http.createServer((req, res) => {
  console.log('we have received a request');
});

const websocket = new WebSocketServer({
  httpServer: httpserver,
});

websocket.on('request', (request) => {
  connection = request.accept(null, request.origin);
  connection.on('open', (e) => console.log('opened'));
  connection.on('close', (e) => console.log('closed'));
  connection.on('message', (message) => {
    console.log('received message', message);
  });
  sendevery5seconds();
});

httpserver.listen(8080, () => console.log('on port 8080'));

function sendevery5seconds() {
  connection.send(`Message ${Math.random()}`);

  setTimeout(sendevery5seconds, 5000);
}
