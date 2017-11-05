const WebSocketServer = require('ws').Server;
const UserSocket = require('./userSocket');
const SocketManager = require('./socketManager');
const { decodeJwtFromQuery } = require('../libs/jwtUtils');
const logger = require('../libs/logger')('websockets');

/**
 * Starts websocket server
 * @param {Object} server HTTP/HTTPS server
 */
const init = (server) => {
  
  const wss = new WebSocketServer({
    server,
    path: '/ws',
    verifyClient: ({ req }) => decodeJwtFromQuery(req),
  });
  
  wss.on('connection', (ws, req) => {
    const { id } = decodeJwtFromQuery(req);
    
    const userSocket = new UserSocket(id, ws);
    userSocket.setHandler('close', () => SocketManager.remove(userSocket));
    userSocket.setHandler('error', () => userSocket.disconnect());
  
    SocketManager.add(userSocket);
  });
  
  console.log('WebSockets server started for path /ws!');
  logger.info('WebSockets server started for path /ws!');
};

module.exports = {
  init,
};
