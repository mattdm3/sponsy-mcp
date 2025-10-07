# Sponsy MCP

This is a an MCP server that interacts with Sponsy's API. Why? Now you can let Cursor or Claude Desktop create or retrieve Sponsy slots or publication details for you.


Built with:

- [Anthropic MCP](https://docs.anthropic.com/en/docs/agents-and-tools/mcp)
- [Cursor](https://cursor.so/)

## Features

- List slots based on date and/or status
- Search for Customers
- List publications
- Get Slot details


## Setup

Currently, you must build the project locally to use this MCP server. Then add the server in [Cursor](#cursor) or [Claude Desktop](#claude-desktop) to use it in any Cursor or Claude Desktop chat.

1. Clone this project locally.

```
git clone https://github.com/mattdm3/sponsy-mcp.git
```

2. Build the project

```
npm install
npm run build
```
3. Setup Sponsy

Create an API key in Sponsy: [Create an API Key](https://getsponsy.com/settings/integrations/api). 


## Claude Desktop + NVM (Node Version Manager [Install] (https://github.com/nvm-sh/nvm))

1. Open Claude's Developer config file

Open Claude Desktop settings and navigate to the "Developer" tab. Click `Edit Config`.

2. Add the MCP server

Add the following config:

```json
{
  "mcpServers": {
    "sponsy-server": {
        "command": "path_to_nodejs", //ie "/Users/home/.nvm/versions/node/v22.20.0/bin/node",
        "args": [
                "path_to_index.js"// ie "/Users/home/sponsy-mcp/dist/index.js"
                ],
        "env": {
              "NODE_OPTIONS": "--no-deprecation"
            }
        }
  }
}
```

You can get the absolute path to your build script by right-clicking on the `/dist/index.js` file in your IDE and selecting `Copy Path`.


3. Test the Setup

Close and reopen Claude Desktop. Verify that the `sponsy-server` tool is available in the Claude developer settings.


Chat with Claude and tell list your publications!
