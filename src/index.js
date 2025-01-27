require("./lib/setup");
const { LogLevel, SapphireClient } = require("@sapphire/framework");
const { GatewayIntentBits, Partials } = require("discord.js");
const { discord_token, clientId, clientSecret } = require("./config.json");
const fs = require("fs");

global.user = "";
const client = new SapphireClient({
  logger: {
    level: LogLevel.Debug,
  },
  intents: [
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
  loadMessageCommandListeners: true,
});

const main = async () => {
  try {
    client.logger.info("Logging in");
    await client.login(discord_token);
    client.logger.info("logged in");
  } catch (error) {
    client.logger.fatal(error);
    client.destroy();
    process.exit(1);
  }
};

main();
