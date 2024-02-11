import { createServer } from 'node:http';
import { getServer } from './server';

import 'dotenv/config'
import { createDB } from './db';

export const server = createServer(getServer(createDB()));
  
server.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`)
}); 
