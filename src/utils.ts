import { UserDTO } from "./models/user";
import { IncomingMessage } from 'node:http';

export function validateUserDTO(userDTO: UserDTO): userDTO is Required<UserDTO> {
    return typeof userDTO.username === 'string' && typeof userDTO.age === 'number' && Array.isArray(userDTO.hobbies);
}


export function readRequestBody<T = any> (req: IncomingMessage): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        let data = '';

        req.on('data', (chunk) => {
            data += chunk;
        })

        req.on('end', () => {
            try {
                resolve(JSON.parse(data))
            } catch (err) {
                reject();
            }
        })

        req.on('error', () => {
            reject();
        });
    });
}