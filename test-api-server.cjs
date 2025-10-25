#!/usr/bin/env node
/**
 * Simple test server to test the geolocation API locally
 * This simulates how the API will work in Azure Static Web Apps
 */

const http = require('http');

// Mock geolocation response for testing
const mockGeolocation = {
  state: 'Texas',
  stateFips: '48'
};

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);
  
  // Handle API requests
  if (req.url === '/api/geolocation') {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify(mockGeolocation));
    return;
  }
  
  // Handle other requests
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found');
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Test API server running on http://localhost:${PORT}`);
  console.log(`Test endpoint: http://localhost:${PORT}/api/geolocation`);
});
