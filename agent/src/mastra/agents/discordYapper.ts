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
`;

export const discordYapperAgent = new Agent({
  name: "Discord Yapper",
  instructions: prompt,
  model: openai("gpt-4o"),
  tools: await mcp.getTools(),
});

client.on("messageCreate", async (message) => {
  if (message.channel.id !== discordChannelId) return;
  if (message.content.includes(discordUserId)) {
    console.log("got message");
    const result = await discordYapperAgent.generate(prompt);
    console.log(result.text);
  }
});

client.login(process.env.DISCORD_TOKEN!);
client.on("ready", async () => {
  console.log(`Logged in as ${client.user?.tag}`);
  const result = await discordYapperAgent.generate(prompt);
  console.log(result.text);
});
