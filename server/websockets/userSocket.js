class UserSocket {
  
  constructor(userId, ws) {
    this.userId = userId;
    this.ws = ws;
  }
  
  send(message) {
    if (this.ws) {
      this.ws.send(message);
    }
  }
  
  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
  
  setHandler(type, handler) {
    if (this.ws) {
      this.ws.on(type, handler);
    }
  }
  
  equals(userSocket) {
    return this.ws && this.ws === userSocket.ws && this.id === userSocket.id;
  }
  
  toString() {
    return `socket for user with id: ${this.userId}`;
  }
  
}

module.exports = UserSocket;
