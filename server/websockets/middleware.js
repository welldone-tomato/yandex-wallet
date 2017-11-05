const SocketManager = require('./socketManager');

module.exports = async (ctx, next) => {
  await next();
  if (ctx.broadcastCards) {
    Object.keys(ctx.broadcastCards).forEach((userId) => {
      SocketManager.broadcast(userId, JSON.stringify({
        type: 'CARD_IDS',
        data: ctx.broadcastCards[userId],
      }));
    });
  }
};