const SocketManager = require('./socketManager');

module.exports = async (ctx, next) => {
  await next();
  if (ctx.broadcastCardIds) {
    const { userId } = ctx.params;
    
    const message = JSON.stringify({
      type: 'CARD_IDS',
      data: ctx.broadcastCardIds,
    });
    
    SocketManager.broadcast(userId, message);
  }
};