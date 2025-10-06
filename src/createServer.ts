import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { buildTools } from "./tools.js";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

export interface CreateServerOptions {
  name?: string;
  version?: string;
}

export function createServer(_opts: CreateServerOptions = {}) {
  const server = new McpServer({
    name: _opts.name ?? "sponsy-mcp",
    version: _opts.version ?? "0.1.0",
  });

  const tools = buildTools();

  for (const t of Object.values(tools)) {
    server.registerTool(
      t.name,
      {
        title: t.name,
        description: t.description,
        // NOTE: this overload wants a ZodRawShape, so pass `.shape`
        inputSchema: t.inputSchema.shape,
      },
      async (args: any): Promise<CallToolResult> => {
        // Validate with the full Zod schema (better errors)
        const parsed = t.inputSchema.parse(args);
        const result = await t.handler(parsed as any);

        // Return a valid ToolResult
        return {
          content: [
            {
              type: "text",
              text:
                typeof result === "string"
                  ? result
                  : JSON.stringify(result, null, 2),
            },
          ],
        };
      }
    );
  }

  const transport = new StdioServerTransport();
  return {
    listen: async () => server.connect(transport),
    server,
  };
}

export * from "./schemas.js";
export * from "./sponsyClient.js";
