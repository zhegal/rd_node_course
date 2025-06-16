import { CreateCLI } from "./cli.js";
import { parseArgs } from "./lib/parseArgs.js";
import { setupRoutes } from "./router.js";

const cli = new CreateCLI();
setupRoutes(cli);

const [, , path, ...args] = process.argv;

cli.run(path, parseArgs(args));
