import fastify from "fastify";
import crypto from 'node:crypto';

const server = fastify({
    logger: {
            transport: {
            target: 'pino-pretty',
            options: {
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
            },
        },
    }
});

server.listen({ port: 3333 }).then(() => { 
    console.log("Server Port: 3333");
})