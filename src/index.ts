// used in a MCP client like Claude;

import { createServer } from "./createServer.js";

async function main() {
  const { listen } = createServer();
  await listen();
  console.error("Sponsy MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
