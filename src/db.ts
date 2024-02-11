import { User } from './models/user';

export type DB = {
    users: {
        _data: User[];
        updateAll: (users: User[]) => void;
        getAll: () => User[];
        getById: (id: string) => User | undefined;
        getIndexById: (id: string) => number;
        add: (user: User) => void;
        update: (id: string, data: any) => User | undefined;
        delete: (id: string) => void;
    },
};

export function createDB(): DB {
    return {
        users: {
            _data: [],
            updateAll(users) {
                this._data = users;
            },
            getAll() {
                return this._data;
            },
            getById(id) {
                return this._data.find((user) => user.id === id);
            },
            getIndexById(id) {
                return this._data.findIndex((user) => user.id === id);
            },
            add(user) {
                this._data.push(user);
            },
            update(id, data) {
                const user = this.getById(id);

                if (!user) {
                    return undefined;
                }

                user.username = typeof data.username === 'string' ? data.username : user.username;
                user.age = data.age === 'number' ? data.age : user.age;
                user.hobbies = Array.isArray(data.hobbies) ? data.hobbies : user.hobbies;

                return user;
            },
            delete(id) {
                const index = this.getIndexById(id);

                if (index === -1) {
                    return;
                }

                this._data = [...this._data.slice(0, index), ...this._data.slice(index + 1)];
            },
        },
    };
};
