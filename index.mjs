import http from 'http';
import ws from 'websocket';
import redis from 'redis';

const APPID = process.env.APPID;
let connections = [];
const WebSocketServer = ws.server;

const subscriber = redis.createClient({
  port: 6379,
  host: 'rds',
});

const publisher = redis.createClient({
  port: 6379,
  host: 'rds',
});

subscriber.on('subscribe', (channel, count) => {
  console.log(
    `Server ${APPID} subscribed successfully to livechat on ${channel}`
  );
  publisher.publish('livechat', 'a message');
});

subscriber.on('message', (channel, message) => {
  try {
    console.log(
      `Server ${APPID} subscribed successfully to livechat on ${channel}`
    );
    connections.forEach((c) => c.send(APPID + ':' + message));
  } catch (ex) {
    console.log('Error ..' + ex);
  }
});

subscriber.subscribe('livechat');

// create a raw server
const httpserver = http.createServer();
const websocket = new WebSocketServer({
  httpServer: httpserver,
});

websocket.on('request', (request) => {
  const connection = request.accept(null, request.origin);
  connection.on('open', (e) => console.log('opened'));
  connection.on('close', (e) => console.log('closed'));
  connection.on('message', (message) => {
    console.log(`${APPID} received message ${message.utf8Data}`);
    publisher.publish('livechat', message.utf8Data);
  });
  setTimeout(() => {
    connection.send(`Connected successfully to server ${APPID}`);
  }, 5000);
  connections.push(connection);
});

httpserver.listen(8080, () => console.log('my server on port 8080 ...'));
