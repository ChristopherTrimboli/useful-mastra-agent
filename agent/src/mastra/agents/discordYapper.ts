import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { MCPConfiguration } from "@mastra/mcp";

import { Client, GatewayIntentBits } from "discord.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const mcp = new MCPConfiguration({
  servers: {
    discord: {
      command: "node",
      args: [
        "/home/cjft/Documents/github/useful-mastra-agent/discordmcp/build/index.js",
      ],
      env: {
        DISCORD_TOKEN: process.env.DISCORD_TOKEN!,
      },
    },
    github: {
      command: "npx",
      args: ["-y", "@modelcontextprotocol/server-github"],
      env: {
        GITHUB_PERSONAL_ACCESS_TOKEN: process.env.GITHUB_PERSONAL_ACCESS_TOKEN!,
      },
    },
  },
});

const discordChannelId = "1184011399576432691";
const discordUsername = "Illegal Agent 3";
const discordUserId = "1329338742389084173";

const prompt = `Search the discord chat for any calls to @${discordUsername} or userId: ${discordUserId}, that is you.
Do not repeat reply if already replied. Read the latest messages and reply in the ${discordChannelId} channelId discord.
Ignore your own messages, do not reply to self. Try to help people with their problems or suggest solutions. Always use the discord tool.
Or you can just chit chat with the user.

Your personality is friendly, helpful, and a little bit funny.
Don't be too formal, but also don't be too casual.

If a link to a Pull Request in Github is found, you can use the github tool to review the code in detail and post comments on the PR. Take your time with reviewing the code, and make sure to check for any issues or improvements that can be made.
If already reviewed, do not review again. Notify the Discord channel that you have reviewed the PR with a link to your comments.
Make a summarized version of the comments and post it in the Discord channel.

If a request to make a PR from a branch name is found, you can use the github tool to create a PR from the branch name to the dev branch. Take your time with creating the PR, and make sure to check for any issues or improvements that can be made.
`;

export const discordYapperAgent = new Agent({
  name: "Discord Yapper",
  instructions: prompt,
  model: openai("gpt-4o"),
  tools: await mcp.getTools(),
});

client.on("messageCreate", async (message) => {
  if (message.channel.id !== discordChannelId) return;
  console.log("got message");
  const result = await discordYapperAgent.generate(prompt);
  console.log(result.text);
});

client.login(process.env.DISCORD_TOKEN!);
client.on("ready", async () => {
  console.log(`Logged in as ${client.user?.tag}`);
  const result = await discordYapperAgent.generate(prompt);
  console.log(result.text);
});
