import { createServer, request, RequestOptions } from 'node:http';
import { getServer } from './server';
import cluster from 'node:cluster';
import { availableParallelism } from 'node:os';

import 'dotenv/config'
import { createDB } from './db';

if (cluster.isPrimary) {
    const numCPUs = availableParallelism();
    const ports = new Array(numCPUs).fill(undefined).map((value, index) => 4001 + index);
    let nextPortIndex = 0;

    const server = createServer((req, res) => {
        const { hostname, pathname } = new URL(req.url!, `http://${req.headers.host}`);

        const options: RequestOptions = {
            hostname,
            port: ports[nextPortIndex],
            path: pathname,
            method: req.method,
            headers: req.headers,
        };

        const proxyReq = request(options, (proxyRes) => {
            res.writeHead(proxyRes.statusCode!, proxyRes.headers);
            proxyRes.pipe(res, { end: true });
        });

        nextPortIndex = (nextPortIndex + 1) % ports.length;

        req.pipe(proxyReq, { end: true });
    });

    server.listen(process.env.PORT, () => {
        console.log(`Load balancer is listening on port ${process.env.PORT}`)
    }); 

    for (let i = 0; i < numCPUs; i++) {
        const worker = cluster.fork({
            PORT: 4001 + i,
        });

        worker.on('message', (msg) => {
            if (msg.type === 'updateUsers') {
                for (const worker of Object.values(cluster.workers ?? {})) {
                    worker?.send({ type: 'updateUsers', users: msg.users })
                }
            }
        })
    }

    cluster.on('exit', (worker) => {
        console.log(`worker ${worker.process.pid} died`);
    });
} else {
    const db = createDB();
    const server = createServer(getServer(db));

    process.on('message', (msg: any) => {
        if (msg.type === 'updateUsers') {
            db.users.updateAll(msg.users);
        }
    });

    server.on('request', () => {
        console.log(`Server on port ${process.env.PORT} received a request`);
    });
      
    server.listen(process.env.PORT, () => {
        console.log(`Server is listening on port ${process.env.PORT}`);
    }); 
}

