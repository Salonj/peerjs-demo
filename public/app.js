// Create Peer connection using PeerJS cloud server
const peer = new Peer(undefined, {
  key: 'peerjs', // Use PeerJS cloud server key
  secure: true   // Ensure secure connection over HTTPS
});

// Store connection for communication
let connection;
let isConnected = false; // Flag to ensure connection message is printed only once

// Display your peer ID
peer.on('open', (id) => {
  document.getElementById('my-peer-id').value = id;
  console.log('Your peer ID is:', id);
});

// Handle incoming connections
peer.on('connection', (conn) => {
  if (!isConnected) {
    connection = conn;
    displayMessage("Connected to a peer!");
    isConnected = true; // Set flag to prevent duplicate messages

    // Setup communication
    setupConnectionHandlers(connection);
  }
});

// Connect to another peer manually by entering their ID
document.getElementById('connect-btn').addEventListener('click', () => {
  const peerId = document.getElementById('peer-id').value;
  if (!isConnected) {
    connection = peer.connect(peerId);
    isConnected = true; // Set flag to prevent duplicate messages
    displayMessage("Successfully connected to the peer!");

    // Setup communication
    setupConnectionHandlers(connection);
  }
});

// Set up connection handlers for sending and receiving data
function setupConnectionHandlers(conn) {
  conn.on('open', () => {
    // Listen for incoming messages
    conn.on('data', (data) => {
      displayMessage(`Peer: ${data}`);
    });

    // Send messages
    document.getElementById('send-btn').addEventListener('click', () => {
      const message = document.getElementById('message').value;
      conn.send(message);
      displayMessage(`You: ${message}`);
      document.getElementById('message').value = '';
    });
  });

  conn.on('error', (err) => {
    displayMessage(`Connection error: ${err}`);
  });
}

// Display messages in the chat box
function displayMessage(message) {
  const messages = document.getElementById('messages');
  const messageElem = document.createElement('div');
  messageElem.textContent = message;
  messages.appendChild(messageElem);
}