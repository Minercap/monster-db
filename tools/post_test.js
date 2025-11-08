const http = require('http');

const data = JSON.stringify({
  nombre: 'POST Test Node',
  usuario_discord: 'node#test',
  telefono: '111',
  monto_pagado: 30.5,
  descripcion_trabajo: 'prueba desde node script',
  notas: 'agregado por node'
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/clientes',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log('STATUS', res.statusCode);
    console.log('BODY', body);
  });
});

req.on('error', (e) => console.error('ERROR', e.message));
req.write(data);
req.end();
