const express = require('express');
const { ExpressPeerServer } = require('peer');
const os = require('os');

// Set up the express server
const app = express();
const server = require('http').createServer(app);

// Serve static files from the "public" directory
app.use(express.static('public'));

// Create PeerJS server
const peerServer = ExpressPeerServer(server, {
  debug: true,
});

app.use('/peerjs', peerServer);

// Get the local IP address
function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
  const localIpAddress = getLocalIpAddress();
  console.log(`Server running on:`);
  console.log(`- Local: http://localhost:${PORT}`);
  console.log(`- Network: http://${localIpAddress}:${PORT}`);
});