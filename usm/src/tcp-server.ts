import * as net from 'net';
import {  Logger } from '@nestjs/common';

const PORT = 3001;
  const logger = new Logger('TCP Server');

export function start() {
    const server = net.createServer((socket) => {
        logger.log('Client connected:', socket.remoteAddress, ':', socket.remotePort);

        socket.on('data', (data) => {
            logger.log(`Received data: ${data.toString()}`);
            socket.write('Message received!');
        });

        socket.on('end', () => {
            logger.log('Client disconnected.');
        });
        socket.on('error', (err) => {
            logger.error('Socket error:', err);
        });
    });

    server.listen(PORT, '127.0.0.1', () => {
        logger.log(`User Microservice is listening on port ${PORT}`);
    });

    server.on('error', (err) => {
        logger.error('Server error:', err);
    });
}
