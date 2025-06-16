import {
  add,
  done,
  list,
  remove,
  stats,
  update,
} from "./controllers/activity.controller.js";

export function setupRoutes(cli) {
  cli.route("add", add);
  cli.route("list", list);
  cli.route("done", done);
  cli.route("stats", stats);
  cli.route("delete", remove);
  cli.route("update", update);
}
