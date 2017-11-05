const SocketManager = require('./socketManager');

module.exports = async (ctx, next) => {
  await next();
  if (ctx.broadcastCardIds) {
  	Object.keys(ctx.broadcastCardIds).forEach( userId => {
	    const message = JSON.stringify({
	      type: 'CARD_IDS',
	      data: ctx.broadcastCardIds[userId],
	    });
	    SocketManager.broadcast(userId, message);
  	});
	    
  }
};