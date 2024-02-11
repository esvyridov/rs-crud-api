import { createServer } from 'node:http';
import { validate, version } from 'uuid';
import { deleteUser, getUser, getUsers, postUser, putUser } from './controllers/users';

import 'dotenv/config'

const usersPathRegex = /^\/api\/users\/(.+)?$/;

export const server = createServer(async (req, res) => {
    try {
        const { pathname } = new URL(req.url!, `http://${req.headers.host}`);

        if (req.url === '/api/users') {
            if (req.method === 'GET') {
                return getUsers(req, res);
            } else if (req.method === 'POST') {
                return await postUser(req, res);
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
                return getUser(id)(req, res);
            } else if (req.method === 'PUT') {
                return await putUser(id)(req, res);
            } else if (req.method === 'DELETE') {
                return deleteUser(id)(req, res);
            }
        }
    
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Requested endpoint is not found');
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain'});
        res.end('Something went wrong');
    }
});
  
server.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`)
}); 
