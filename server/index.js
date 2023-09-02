
const http = require('http');


class WebSocketServer extends EventEmitter{
  constructor(options, callback){
    super();

    options = {
      maxPayload: 100 * 1024 * 1024,
      skipUTF8Validation: false,
      perMessageDeflate: false,
      handleProtocols: null,
      clientTracking: true,
      verifyClient: null,
      noServer: false,
      backlog: null,
      server: null,
      host: null,
      path: null,
      port: null
    };

    if(
      (options.port == null && !options.server && !options.noServer) || 
      (options.port != null && (options)) || 
      (options.server && options.noServer)
    ){
      throw new TypeError(
        'One and only one of the "port", "server", or "noServer" options must be specified'
      )
    }


    if(options.port != null){
      this.server = http.createServer((req, res) => {
        const body = http.STATUS_CODES[426];
        res.writeHead(426, {
          'Content-Length': body.length,
          'Content-Type': 'text/plain'
        });
        res.end(body);
      });

      this.server.listen(
        options.port,
        options.host,
        options.backlog,
        callback
      );
    }else if(options.server){
      this.server = options.server;
    }

    if(this.server){
      const emitConnection = this.emit.bind(this, 'connection');

      this.removeListeners = addL
    }
  }
}
