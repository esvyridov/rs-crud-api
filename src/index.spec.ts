import { server } from './index';
import request from 'supertest';

describe('API', () => {
    afterAll(() => server.close());

    describe('GET /api/users', () => {
        test('Returns `Content-Type: application/json, status 200 and empty array in body', async () => {
            return request(server)
                .get('/api/users')
                .expect('Content-Type', 'application/json')
                .expect(200)
                .then((res) => {
                    expect(res.body).toEqual({
                        ok: true,
                        data: {
                            users: [],
                        }
                    });
                });
        });
    });
    
    describe('POST /api/users', () => {
        test('Returns Content-Type: application/json, status 201 and newly created user in body if a user was created', async () => {
            return request(server)
                .post('/api/users')
                .send({
                    username: 'Bob',
                    age: 54,
                    hobbies: ['Books']
                })
                .expect('Content-Type', 'application/json')
                .expect(201)
                .then((res) => {
                    expect(res.body).toEqual({
                        ok: true,
                        data: {
                            user: {
                                id: expect.any(String),
                                username: 'Bob',
                                age: 54,
                                hobbies: ['Books']
                            },
                        },
                    });
                })
        })
    
        test('Returns Content-Type: application/json, status 500 with error message', async () => {
            return request(server)
                .post('/api/users')
                .send("String")
                .expect('Content-Type', 'application/json')
                .expect(500)
                .then((res) => {
                    expect(res.body).toEqual({
                        ok: false,
                        error: 'Internal server error.'
                    })
                })
        });
    
        describe('Returns Content-Type: application/json, status 400 with error message', () => {
            test('when username is not provided', async () => {
                return request(server)
                    .post('/api/users')
                    .send({
                        age: 54,
                        hobbies: ['Books']
                    })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .then((res) => {
                        expect(res.body).toEqual({
                            ok: false,
                            error: 'Provided user is not valid.',
                            errors: {
                                username: 'Field username is not provided.',
                            }
                        })
                    })
            });
    
            test('when username is not string', async () => {
                return request(server)
                    .post('/api/users')
                    .send({
                        username: 100,
                        age: 54,
                        hobbies: ['Books']
                    })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .then((res) => {
                        expect(res.body).toEqual({
                            ok: false,
                            error: 'Provided user is not valid.',
                            errors: {
                                username: 'Field username is not a string.',
                            }
                        })
                    })
            });
    
            test('when age is not provided', async () => {
                return request(server)
                    .post('/api/users')
                    .send({
                        username: 'Bob',
                        hobbies: ['Books']
                    })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .then((res) => {
                        expect(res.body).toEqual({
                            ok: false,
                            error: 'Provided user is not valid.',
                            errors: {
                                age: 'Field age is not provided.',
                            }
                        })
                    })
            });
    
            test('when age is not a number', async () => {
                return request(server)
                    .post('/api/users')
                    .send({
                        username: 'Bob',
                        age: '54',
                        hobbies: ['Books']
                    })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .then((res) => {
                        expect(res.body).toEqual({
                            ok: false,
                            error: 'Provided user is not valid.',
                            errors: {
                                age: 'Field age is not a number.',
                            }
                        })
                    })
            });
    
            test('when hobbies are not provided', async () => {
                return request(server)
                    .post('/api/users')
                    .send({
                        username: 'Bob',
                        age: 54,
                    })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .then((res) => {
                        expect(res.body).toEqual({
                            ok: false,
                            error: 'Provided user is not valid.',
                            errors: {
                                hobbies: 'Field hobbies is not provided.',
                            }
                        })
                    })
            });
    
            test('when hobbies are not an array', async () => {
                return request(server)
                    .post('/api/users')
                    .send({
                        username: 'Bob',
                        age: 54,
                        hobbies: 'Books',
                    })
                    .expect('Content-Type', 'application/json')
                    .expect(400)
                    .then((res) => {
                        expect(res.body).toEqual({
                            ok: false,
                            error: 'Provided user is not valid.',
                            errors: {
                                hobbies: 'Field hobbies is not an array.',
                            }
                        })
                    })
            });
        });
    })
    
    describe('GET /api/users/:id', () => {
        test('Returns Content-Type: application/json, status 400 with error if provided userId is not valid uuidv4', async () => {
            return request(server)
                .get('/api/users/1')
                .expect('Content-Type', 'application/json')
                .expect(400)
                .then((res) => {
                    expect(res.body).toEqual({
                        ok: false,
                        error: 'Provided userId is not valid.',
                    })
                })
        });
    
        test('Returns Content-Type: application/json, status 404 with error if userId is not found', async () => {
            return request(server)
                .get('/api/users/b47d10c2-d4a4-435e-9958-958226eddf62')
                .expect('Content-Type', 'application/json')
                .expect(404)
                .then((res) => {
                    expect(res.body).toEqual({
                        ok: false,
                        error: 'User is not found.',
                    })
                })
        })
    
        test('Returns Content-Type: application/json, status 200 and newly created user if userId is found', async () => {
            const { body } = await request(server)
                .post('/api/users')
                .send({
                    username: 'Bob',
                    age: 54,
                    hobbies: ['Books']
                })
            
            return request(server)
                .get(`/api/users/${body.data.user.id}`)
                .expect('Content-Type', 'application/json')
                .expect(200)
                .then((res) => {
                    expect(res.body).toEqual({
                        ok: true,
                        data: {
                            user: body.data.user,
                        }
                    })
                })
        })
    });
    
    
    describe('PUT /api/users/:id', () => {
        test('Returns Content-Type: application/json, status 400 with error if provided userId is not valid uuidv4', async () => {
            return request(server)
                .put('/api/users/1')
                .send({
                    username: 'Alice',
                })
                .expect('Content-Type', 'application/json')
                .expect(400)
                .then((res) => {
                    expect(res.body).toEqual({
                        ok: false,
                        error: 'Provided userId is not valid.',
                    })
                })
        })
    
        test('Returns Content-Type: application/json, status 404 with error if userId is not found', async () => {
            return request(server)
                .put('/api/users/b47d10c2-d4a4-435e-9958-958226eddf62')
                .expect('Content-Type', 'application/json')
                .expect(404)
                .then((res) => {
                    expect(res.body).toEqual({
                        ok: false,
                        error: 'User is not found.',
                    })
                })
        })
    
        test('Returns Content-Type: application/json, status 200 and newly updated user if userId is found', async () => {
            const { body } = await request(server)
                .post('/api/users')
                .send({
                    username: 'Bob',
                    age: 54,
                    hobbies: ['Books']
                })
            
            return request(server)
                .put(`/api/users/${body.data.user.id}`)
                .send({
                    username: 'Alice',
                })
                .expect('Content-Type', 'application/json')
                .expect(200)
                .then((res) => {
                    expect(res.body).toEqual({
                        ok: true,
                        data: {
                            user: {
                                ...body.data.user,
                                username: 'Alice',
                            },
                        }
                    })
                })
        })
    });
    
    
    describe('DELETE /api/users/:id', () => {
        test('Returns Content-Type: application/json, status 400 with error if provided userId is not valid uuidv4', async () => {
            return request(server)
                .delete('/api/users/1')
                .expect('Content-Type', 'application/json')
                .expect(400)
                .then((res) => {
                    expect(res.body).toEqual({
                        ok: false,
                        error: 'Provided userId is not valid.',
                    })
                })
        });
    
        test('Returns Content-Type: application/json, status 404 with error if userId is not found', async () => {
            return request(server)
                .get('/api/users/b47d10c2-d4a4-435e-9958-958226eddf62')
                .expect('Content-Type', 'application/json')
                .then((res) => {
                    expect(res.body).toEqual({
                        ok: false,
                        error: 'User is not found.',
                    })
                })
        })
    
        test('Returns Content-Type: application/json, status 204 if userId is found', async () => {
            const { body } = await request(server)
                .post('/api/users')
                .send({
                    username: 'Bob',
                    age: 54,
                    hobbies: ['Books']
                })
            
            return request(server)
                .delete(`/api/users/${body.data.user.id}`)
                .expect('Content-Type', 'application/json')
                .expect(204)
        })
    });
    
    
    test('404 Not Found', async () => {
        return request(server)
            .get('/users/1')
            .expect('Content-Type', 'application/json')
            .expect(404)
            .then((res) => {
                expect(res.body).toEqual({
                    ok: false,
                    error: "Endpoint doesn't exist.",
                })
            })
    });
})

