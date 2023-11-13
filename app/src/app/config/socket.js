class WebSocketClient {
    constructor() {
      this.socket = new WebSocket('ws://localhost:3000');
  
      this.socket.addEventListener('open', this.handleOpen.bind(this));
      this.socket.addEventListener('message', this.handleMessage.bind(this));
      this.socket.addEventListener('close', this.handleClose.bind(this));
    }
  
    handleOpen(event) {
      console.log('Connected to the WebSocket server');
    }
  
    handleMessage(event) {
      console.log(`Received message from server: ${event.data}`);
    
    }
  
    handleClose(event) {
      console.log('Connection closed');
    }
  
    sendMessage(message) {
      this.socket.send(message);
    }
  }

  export {
    WebSocketClient
  }