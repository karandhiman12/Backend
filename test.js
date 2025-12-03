//http server without express

const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');

// Create HTTP server
const server = http.createServer((req, res) => {
  // Parse URL and method
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method.toLowerCase();
  const query = parsedUrl.query;

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (method === 'options') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Basic routing
  if (method === 'get') {
    handleGetRequest(pathname, query, res);
  } else if (method === 'post') {
    handlePostRequest(pathname, req, res);
  } else if (method === 'put') {
    handlePutRequest(pathname, req, res);
  } else if (method === 'delete') {
    handleDeleteRequest(pathname, res);
  } else {
    // Method not allowed
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
  }
});

// Handle GET requests
function handleGetRequest(pathname, query, res) {
  if (pathname === '/') {
    // Home route
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Node.js HTTP Server</title>
        </head>
        <body>
          <h1>Welcome to Node.js HTTP Server</h1>
          <p>Server is running without Express!</p>
          <ul>
            <li><a href="/api/users">GET /api/users</a></li>
            <li><a href="/api/health">GET /api/health</a></li>
            <li><a href="/about">GET /about</a></li>
          </ul>
        </body>
      </html>
    `);
  } else if (pathname === '/api/users') {
    // API route - get users
    const users = [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
      { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
    ];
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ users, query }));
  } else if (pathname === '/api/health') {
    // Health check route
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    }));
  } else if (pathname === '/about') {
    // About page
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('This is a Node.js HTTP server built without Express framework.');
  } else {
    // 404 Not Found
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Route not found' }));
  }
}

// Handle POST requests
function handlePostRequest(pathname, req, res) {
  if (pathname === '/api/users') {
    let body = '';
    
    // Collect request body data
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const userData = JSON.parse(body);
        
        // Basic validation
        if (!userData.name || !userData.email) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Name and email are required' }));
          return;
        }
        
        // Simulate creating user
        const newUser = {
          id: Date.now(), // Simple ID generation
          name: userData.name,
          email: userData.email,
          createdAt: new Date().toISOString()
        };
        
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User created', user: newUser }));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Route not found' }));
  }
}

// Handle PUT requests
function handlePutRequest(pathname, req, res) {
  if (pathname.startsWith('/api/users/')) {
    const userId = pathname.split('/')[3];
    
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const userData = JSON.parse(body);
        
        // Simulate updating user
        const updatedUser = {
          id: parseInt(userId),
          name: userData.name,
          email: userData.email,
          updatedAt: new Date().toISOString()
        };
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User updated', user: updatedUser }));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Route not found' }));
  }
}

// Handle DELETE requests
function handleDeleteRequest(pathname, res) {
  if (pathname.startsWith('/api/users/')) {
    const userId = pathname.split('/')[3];
    
    // Simulate deleting user
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      message: `User ${userId} deleted successfully` 
    }));
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Route not found' }));
  }
}

// Error handling
server.on('error', (err) => {
  console.error('Server error:', err);
});

// Start server
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

server.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}/`);
  console.log('Available routes:');
  console.log('  GET  /');
  console.log('  GET  /api/users');
  console.log('  GET  /api/health');
  console.log('  GET  /about');
  console.log('  POST /api/users');
  console.log('  PUT  /api/users/:id');
  console.log('  DELETE /api/users/:id');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

//nothing much