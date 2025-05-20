import { setupRoutes } from './router.js';
import { Server } from './Server.js';

const server = new Server(3001);
setupRoutes(server);

server.run();
