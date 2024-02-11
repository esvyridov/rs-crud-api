import { UserDTO } from "./models/user";
import { IncomingMessage } from 'node:http';

export function validateUserDTO(userDTO: UserDTO): Record<string, string> {
    const errors: Record<string, string> = {};

    if (typeof userDTO.username === 'undefined') {
        errors.username = 'Field username is not provided.';
    } else if (typeof userDTO.username !== 'string') {
        errors.username = 'Field username is not a string.';
    }

    if (typeof userDTO.age === 'undefined') {
        errors.age = 'Field age is not provided.';
    } else if (typeof userDTO.age !== 'number') {
        errors.age = 'Field age is not a number.';
    }

    if (typeof userDTO.hobbies === 'undefined') {
        errors.hobbies = 'Field hobbies is not provided.';
    } else if (!Array.isArray(userDTO.hobbies)) {
        errors.hobbies = 'Field hobbies is not an array.';
    }

    return errors;
}

export function isUserDTOValid(userDTO: UserDTO): userDTO is Required<UserDTO> {
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