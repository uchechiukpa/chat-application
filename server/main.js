// const net  = require("net");
// const crypto = require("crypto");
// const { EventEmitter } = require("stream");
// const {createHash} = require("crypto")

// const server = net.createServer((socket) => {
//     console.log("client created");
//     let receievedData = ''
//     socket.on('data', (data) => {

//         receievedData += data.toString()
//         console.log(`Recieved data ${receievedData}`);
//         const headers = receievedData.split('\r\n');

//         const keyValuePair = headers.find((header) => header.startsWith("Sec-WebSocket-Key"));


//         if(keyValuePair){
//             const secWebsocketKey =  keyValuePair.split(': ')[1];
//             const secWebSocketAccept = generateHash(secWebsocketKey);

//             const responseHeaders = [
//                 'HTTP/1.1 101 Switching Protocols',
//                 'Upgrade: websocket',
//                 'Connection: Upgrade',
//                 `Sec-WebSocket-Accept: ${secWebSocketAccept}`,
//               ];


//             socket.write(responseHeaders.concat('\r\n').join('\r\n'));
//         }

//         socket.on('message')

//     });

  


//     socket.on('error', (error)=> {
//         console.log(`error occurred ${error}`)
//     })

//     socket.on('close', () => {
//         console.log("client disconnected");
//     });
// });


// server.listen(8080, () =>{
//     console.log("server listening on port 8080")
// });


// function generateHash( hashValue){
//     const magicKey = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"
//     return crypto.createHash('sha1').update(`${hashValue}${magicKey}`, "binary").digest("base64")

// }







// class wesSocketServer extends EventEmitter{
//     constructor(){
//         super();
//     }






//     handleUpgrade(req, socket, head, cb){

//         socket.on('error', ()=>{
//             console.log(error)
//         });

//         const key = req.headers['sec-websocket-key'];
//         const version = req.headers['sec-websocket-version'];

//         // if(req.method !== 'GET'){

//         // }

//         this.completeUpgrade(key, req, socket)

//     }


//     completeUpgrade(key, req, socket){
//         const guid = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"
//         const digest = createHash('sha1').update(key + guid).digest("base64");

//         const headers = [
//             'HTTP/1.1 101 Switching Protocols',
//             'Upgrade: websocket',
//             'Connection: Upgrade',
//             `Sec-WebSocket-Accept: ${digest}`
//           ];

//         socket.write(headers.concat('\r\n').join('\r\n'));
//     }
// }



const { WebSocketServer } = require('ws');

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('error', console.error);

  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });

  ws.send('something');
});


const app = require('express');
