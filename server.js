//DENNA FIL EXEKVERAS FÖRST OCH HÄR SKAPAR VI SJÄLVA SERVERN OCH PORTNUMMERN FÖR VÅR REST API
const http = require('http');
const app = require('./app');

//Definierar portnummer
const port = 8080;

//Skapar en ny http-server där app fungerar som request-listener. Dvs. om det kommer
//en inkommande "request" på port 8080 är det koden i app.js som tar hand om requesten
const server = http.createServer(app)

//Startar servern och börjar lyssna på porten
server.listen(port);