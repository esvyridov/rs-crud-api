import { IncomingMessage, ServerResponse } from 'node:http';
import { validate, version } from 'uuid';
import { deleteUser, getUser, getUsers, postUser, putUser } from './controllers/users';
import { DB } from './db';

const usersPathRegex = /^\/api\/users\/(.+)?$/;

export function getServer(db: DB) {
    return async (req: IncomingMessage, res: ServerResponse) => {
        try {
            const { pathname } = new URL(req.url!, `http://${req.headers.host}`);
    
            if (pathname === '/api/users') {
                if (req.method === 'GET') {
                    return getUsers(db)(req, res);
                } else if (req.method === 'POST') {
                    return await postUser(db)(req, res);
                }
            }
        
            if (usersPathRegex.test(pathname)) {
                const [, id] = pathname.match(usersPathRegex) ?? [];
                const isIdValid = validate(id) && version(id) === 4;
        
                if (!isIdValid) {
                    res.writeHead(400, { 'Content-Type': 'text/plain' });
                    res.end('Provided userId is not valid.');
                    return;
                }
        
                if (req.method === 'GET') {
                    return getUser(db, id)(req, res);
                } else if (req.method === 'PUT') {
                    return await putUser(db, id)(req, res);
                } else if (req.method === 'DELETE') {
                    return deleteUser(db, id)(req, res);
                }
            }
        
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Requested endpoint is not found');
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain'});
            res.end('Something went wrong');
        }
    }
}