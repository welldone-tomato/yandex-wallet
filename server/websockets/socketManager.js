const logger = require('../libs/logger')('websockets/SocketManager');

let _userSocketsStore = {};

const add = (userSocket) => {
  const { userId, ws } = userSocket;
  if (!ws) return;
  _userSocketsStore[userId] = _userSocketsStore[userId] || [];
  _userSocketsStore[userId].push(userSocket);
  log('Added', userSocket);
};

const remove = (userSocket) => {
  const { userId } = userSocket;
  const userSockets = _userSocketsStore[userId];
  if (!userSockets) return;
  const index = userSockets.findIndex(_userSocket => _userSocket.equals(userSocket));
  if (index === -1) return;
  userSockets.splice(index, 1);
  log('Removed', userSocket);
};

const broadcast = (userId, message) => {
  _userSocketsStore[userId].forEach(userSocket => userSocket.send(message));
};

const log = (eventType, userSocket) => {
  logger.info(`
    ${eventType} ${userSocket};
    all user connections: ${_userSocketsStore[userSocket.userId].length};
    all connections: ${Object.values(_userSocketsStore).reduce((sum, sockets) => sum + sockets.length, 0)}
  `);
};

module.exports = {
  add,
  remove,
  broadcast,
};
