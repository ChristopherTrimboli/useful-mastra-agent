import { Mastra } from "@mastra/core";
import { discordYapperAgent } from "./agents/discordYapper";

export const mastra = new Mastra({
  agents: { discordYapperAgent },
});
