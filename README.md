# Basic CRUD API

Install the dependencies using `npm i` command.

## Available Scripts

In the project directory, you can run:

### `npm start:dev`

Runs the app in the development mode.\
Send requests to [http://localhost:4000](http://localhost:4000) to start using the API.

### `npm start:prod`

Runs the app in the production mode.\
Send requests to [http://localhost:4000](http://localhost:4000) to start using the API.

### `npm start:multi`

Runs the app in the development mode with the Load Balancer.\
The Load Balancer is running on the port 4000 and all workers are running on the ports starting from 4001 to (whatever number of parallel processes your machine supports). The Load Balancer is implemented using Round Robin technique.\
Send requests to [http://localhost:4000](http://localhost:4000) to start using the API.

## Scope

[x] The repository with the application contains a Readme.md file containing detailed instructions for installing, running and using the application\
[x] GET api/users implemented properly\
[x] GET api/users/{userId} implemented properly\
[x] POST api/users implemented properly\
[x] PUT api/users/{userId} implemented properly\
[x] DELETE api/users/{userId} implemented properly\
[x] Users are stored in the form described in the technical requirements\
[x] Value of port on which application is running is stored in .env file
### Advanced Scope
[x] Task implemented on Typescript\
[x] Processing of requests to non-existing endpoints implemented properly\
[x] Errors on the server side that occur during the processing of a request should be handled and processed properly\
[x] Development mode: npm script start:dev implemented properly\
[x] Production mode: npm script start:prod implemented properly
### Hacker Scope
[x] There are tests for API (not less than 3 scenarios)\
[x] There is horizontal scaling for application with a load balancer