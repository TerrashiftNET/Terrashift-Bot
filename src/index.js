require('./lib/setup');
const { LogLevel, SapphireClient } = require('@sapphire/framework');
const { prefix, discord_token, clientId, clientSecret } = require('./config.json');
const { GatewayIntentBits, Partials } = require('discord.js');
global.user = '';
const fs = require('fs');
const { OAuth2Scopes } = require('discord.js');

const client = new SapphireClient({
	logger: {
		level: LogLevel.Debug
	},
	// shards: 'auto',
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
		GatewayIntentBits.MessageContent
	],
	partials: [Partials.Channel],
	loadMessageCommandListeners: true,
});

const main = async () => {
	try {
		client.logger.info('Logging in');
		await client.login(discord_token);
		client.logger.info('logged in');
		// check if markers.json exists
		if (!fs.existsSync('./markers.json')) {
			// if it doesn't, create it
			fs.writeFileSync('./markers.json', JSON.stringify({ markers: [], last_id: 0 }));
		}
		if (!fs.existsSync('./farm-prot.json')) {
			fs.writeFileSync('./farm-prot.json', JSON.stringify({ farms: [] }));
		}
	} catch (error) {
		client.logger.fatal(error);
		client.destroy();
		process.exit(1);
	}
};

main();
