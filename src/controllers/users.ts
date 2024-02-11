import { IncomingMessage, ServerResponse } from 'node:http';
import cluster from 'node:cluster';
import { isUserDTOValid, readRequestBody, validateUserDTO } from '../utils';
import { User, UserDTO } from '../models/user';
import { v4 as uuidv4 } from 'uuid';
import { DB } from '../db';

export function getUsers(db: DB) {
    return (req: IncomingMessage, res: ServerResponse) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            ok: true,
            data: {
                users: db.users.getAll()
            }
        }));
    }
}

export function getUser(db: DB, id: string) {
    return (req: IncomingMessage, res: ServerResponse) => {
        const user = db.users.getById(id);
    
        if (!user) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                ok: false,
                error: 'User is not found.'
            }));
            return;
        }
    
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            ok: true,
            data: {
                user
            }
        }))
    }
}

export function postUser(db: DB) {
    return async (req: IncomingMessage, res: ServerResponse) => {
        const userDTO = await readRequestBody<UserDTO>(req);
            
        if (isUserDTOValid(userDTO)) {
            const user: User = {
                id: uuidv4(),
                ...userDTO,
            };

            db.users.add(user);

            cluster.isWorker && process.send?.({ type: 'updateUsers', users: db.users.getAll() });

            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                ok: true,
                data: {
                    user,
                }
            }));
        } else {
            const errors = validateUserDTO(userDTO);
            
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                ok: false,
                error: 'Provided user is not valid.',
                errors,
            }));
        }
    }
}

export function putUser(db: DB, id: string) {
    return async (req: IncomingMessage, res: ServerResponse) => {
        const user = db.users.getById(id);

        if (!user) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                ok: false,
                error: 'User is not found.'
            }));
            return;
        }

        const body = await readRequestBody(req);
        const updatedUser = db.users.update(id, body);

        cluster.isWorker && process.send?.({ type: 'updateUsers', users: db.users.getAll() });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            ok: true,
            data: {
                user: updatedUser
            }
        }));
    }
}

export function deleteUser(db: DB, id: string) {
    return (req: IncomingMessage, res: ServerResponse) => {
        const index = db.users.getIndexById(id);

        if (index === -1) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                ok: false,
                error: 'User is not found.'
            }));
            return;
        }

        db.users.delete(id);

        cluster.isWorker && process.send?.({ type: 'updateUsers', users: db.users.getAll() });

        res.writeHead(204, { 'Content-Type': 'application/json' });
        res.end();
    }
}