import { server } from './index';
import request from 'supertest';

describe('API', () => {
    afterAll(() => server.close());

    describe('GET /api/users', () => {
        test('Returns `Content-Type: application/json, status 200 and empty array in body', async () => {
            return request(server)
                .get('/api/users')
                .expect('Content-Type', 'application/json')
                .expect(200, [])
                .then((res) => {
                    expect(res.body).toEqual([]);
                })
        })
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
                        id: expect.any(String),
                        username: 'Bob',
                        age: 54,
                        hobbies: ['Books']
                    });
                })
        })
    
        test('Returns Content-Type: text/plain, status 500 with error message', () => {
            return request(server)
                .post('/api/users')
                .send("String")
                .expect('Content-Type', 'text/plain')
                .expect(500, 'Something went wrong')
        });
    
        describe('Returns Content-Type: text/plain, status 400 with error message', () => {
            test('when username is not provided', () => {
                return request(server)
                    .post('/api/users')
                    .send({
                        age: 54,
                        hobbies: ['Books']
                    })
                    .expect('Content-Type', 'text/plain')
                    .expect(400, 'User is not valid')
            });
    
            test('when username is not string', () => {
                return request(server)
                    .post('/api/users')
                    .send({
                        username: 100,
                        age: 54,
                        hobbies: ['Books']
                    })
                    .expect('Content-Type', 'text/plain')
                    .expect(400, 'User is not valid')
            });
    
            test('when age is not provided', () => {
                return request(server)
                    .post('/api/users')
                    .send({
                        username: 'Bob',
                        hobbies: ['Books']
                    })
                    .expect('Content-Type', 'text/plain')
                    .expect(400, 'User is not valid')
            });
    
            test('when age is not a number', () => {
                return request(server)
                    .post('/api/users')
                    .send({
                        username: 'Bob',
                        age: '54',
                        hobbies: ['Books']
                    })
                    .expect('Content-Type', 'text/plain')
                    .expect(400, 'User is not valid')
            });
    
            test('when hobbies are not provided', () => {
                return request(server)
                    .post('/api/users')
                    .send({
                        username: 'Bob',
                        age: 54,
                    })
                    .expect('Content-Type', 'text/plain')
                    .expect(400, 'User is not valid')
            });
    
            test('when hobbies are not an array', () => {
                return request(server)
                    .post('/api/users')
                    .send({
                        username: 'Bob',
                        age: 54,
                        hobbies: 'Books',
                    })
                    .expect('Content-Type', 'text/plain')
                    .expect(400, 'User is not valid')
            });
        });
    })
    
    describe('GET /api/users/:id', () => {
        test('Returns Content-Type: text/plain, status 400 with error if provided userId is not valid uuidv4', () => {
            return request(server)
                .get('/api/users/1')
                .expect('Content-Type', 'text/plain')
                .expect(400, 'Provided userId is not valid.')
        });
    
        test('Returns Content-Type: text/plain, status 404 with error if userId is not found', () => {
            return request(server)
                .get('/api/users/b47d10c2-d4a4-435e-9958-958226eddf62')
                .expect('Content-Type', 'text/plain')
                .expect(404, 'User is not found.')
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
                .get(`/api/users/${body.id}`)
                .expect('Content-Type', 'application/json')
                .expect(200, body)
        })
    });
    
    
    describe('PUT /api/users/:id', () => {
        test('Returns Content-Type: text/plain, status 400 with error if provided userId is not valid uuidv4', () => {
            return request(server)
                .put('/api/users/1')
                .send({
                    username: 'Alice',
                })
                .expect('Content-Type', 'text/plain')
                .expect(400, 'Provided userId is not valid.')
        })
    
        test('Returns Content-Type: text/plain, status 404 with error if userId is not found', () => {
            return request(server)
                .put('/api/users/b47d10c2-d4a4-435e-9958-958226eddf62')
                .expect('Content-Type', 'text/plain')
                .expect(404, 'User is not found.')
        })
    
        test('Returns Content-Type: application/json, status 201 and newly created user if userId is found', async () => {
            const { body } = await request(server)
                .post('/api/users')
                .send({
                    username: 'Bob',
                    age: 54,
                    hobbies: ['Books']
                })
            
            return request(server)
                .put(`/api/users/${body.id}`)
                .send({
                    username: 'Alice',
                })
                .expect('Content-Type', 'application/json')
                .expect(201, {
                    ...body,
                    username: 'Alice',
                })
        })
    });
    
    
    describe('DELETE /api/users/:id', () => {
        test('Returns Content-Type: text/plain, status 400 with error if provided userId is not valid uuidv4', () => {
            return request(server)
                .delete('/api/users/1')
                .expect('Content-Type', 'text/plain')
                .expect(400, 'Provided userId is not valid.')
        });
    
        test('Returns Content-Type: text/plain, status 404 with error if userId is not found', () => {
            return request(server)
                .get('/api/users/b47d10c2-d4a4-435e-9958-958226eddf62')
                .expect('Content-Type', 'text/plain')
                .expect(404, 'User is not found.')
        })
    
        test('Returns Content-Type: application/json, status 204 and newly created user if userId is found', async () => {
            const { body } = await request(server)
                .post('/api/users')
                .send({
                    username: 'Bob',
                    age: 54,
                    hobbies: ['Books']
                })
            
            return request(server)
                .delete(`/api/users/${body.id}`)
                .expect('Content-Type', 'text/plain')
                .expect(204)
        })
    });
    
    
    test('404 Not Found', () => {
        return request(server)
            .get('/users/1')
            .expect('Content-Type', 'text/plain')
            .expect(404, 'Requested endpoint is not found')
    });
})

