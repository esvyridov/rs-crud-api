import { IncomingMessage, ServerResponse } from 'node:http';
import { readRequestBody, validateUserDTO } from '../utils';
import { User, UserDTO } from '../models/user';
import { v4 as uuidv4 } from 'uuid';

let users: User[] = [];

export function getUsers(req: IncomingMessage, res: ServerResponse) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
}

export function getUser(id: string) {
    return (req: IncomingMessage, res: ServerResponse) => {
        const user = users.find((user) => user.id === id);
    
        if (!user) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end(`User is not found.`);
            return;
        }
    
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(user))
    }
}

export async function postUser(req: IncomingMessage, res: ServerResponse) {
    const userDTO = await readRequestBody<UserDTO>(req);
        
    if (validateUserDTO(userDTO)) {
        const user: User = {
            id: uuidv4(),
            ...userDTO,
        };

        users.push(user);

        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(user))
    } else {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('User is not valid')
    }
}

export function putUser(id: string) {
    return async (req: IncomingMessage, res: ServerResponse) => {
        const index = users.findIndex((user) => user.id === id);
        const user = users[index];

        if (index === -1) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end(`User is not found.`);
            return;
        }

        const body = await readRequestBody(req);
                        
        users[index] = {
            id: user.id,
            username: typeof body.username === 'string' ? body.username : user.username,
            age: typeof body.age === 'number' ? body.age : user.age,
            hobbies: Array.isArray(body.hobbies) ? body.hobbies : user.hobbies,
        };
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(users[index]));
    }
}

export function deleteUser(id: string) {
    return (req: IncomingMessage, res: ServerResponse) => {
        const index = users.findIndex((user) => user.id === id);

        if (index === -1) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end(`User is not found.`);
            return;
        }
        
        users = [...users.slice(0, index), ...users.slice(index + 1)];

        res.writeHead(204, { 'Content-Type': 'text/plain' });
        res.end();
    }
}