import "dotenv/config";
import * as http from "node:http";
import { router } from "./lib/router.js";

const server = http.createServer(router);
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server started at port: ${PORT}`);
});
