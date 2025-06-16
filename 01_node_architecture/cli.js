export class CreateCLI {
  constructor() {
    this.routes = {};
  }

  route(path, controller) {
    this.routes[path] = controller;
  }

  run(path, args) {
    if (!path) {
      console.warn("\x1b[31m%s\x1b[0m", `Error: Missing arguments`);
      return;
    }
    const controller = this.routes[path];
    if (!controller) {
      console.warn("\x1b[31m%s\x1b[0m", `Error: Path doesn't exists`);
      return;
    }

    try {
      controller(args);
    } catch (err) {
      console.error("\x1b[31m%s\x1b[0m", `Unhandled error: ${err.message}`);
    }
  }
}
