const { Command } = require('@sapphire/framework');
const { EmbedBuilder } = require('@discordjs/builders');
const https = require('https');
const { ptero_token, creative_server_id, schedule_id } = require('../config.json');
const fs = require('fs');
const path = require('path');

class UserCommand extends Command {
	/**
	 * @param {Command.Context} context
	 */
	constructor(context) {
		super(context, {
			// Any Command options you want here
			name: 'lock',
			description: 'Lock the creative server and prevent it from being overwritten'
		});
	}

	/**
	 * @param {Command.Registry} registry
	 */
	registerApplicationCommands(registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
		);
	}

	/**
	 * @param {Command.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
		if (interaction.inGuild()) {
		const embed = new EmbedBuilder()
			.setTitle('Creative Server Locked')
			.setDescription(`Creative Server has been locked by <@${interaction.user.id}>, it will no longer be overwritten`);

		const data = JSON.stringify({
			name: 'Creative Reset',
			is_active: false,
			minute: '0',
			hour: '0',
			day_of_month: '*',
			day_of_week: '*',
			month: '*/12'
		});

		const options = {
			hostname: 'admin.terrashift.net',
			path: '/api/client/servers/' + creative_server_id + '/schedules/' + schedule_id,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: `Bearer ${ptero_token}`
			}
		};

		const req = https
			.request(options, (res) => {
				let data = '';

				console.log('Status Code:', res.statusCode);

				res.on('data', (chunk) => {
					data += chunk;
				});

				res.on('end', () => {
					console.log('Body: ', JSON.parse(data));
				});
			})
			.on('error', (err) => {
				console.log('Error: ', err.message);
			});

		req.write(data);
		req.end();

		const member = interaction.user.id;
		// if lock.json doesn't exist, create it
		if (!fs.existsSync(path.join(__dirname, '../lock.json'))) {
			fs.writeFileSync(path.join(__dirname, '../lock.json'), '[]');
		}

		// if the user is already in lock.json, return
		const lock = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../lock.json'), 'utf8'));
		if (lock.some((obj) => Object.keys(obj)[0] == member)) {
			await interaction.reply({ content: 'You have already locked the creative server', ephemeral: true });
			return;
		}

		//append the user and the current unix timestamp to lock.json
		const newLock = {
			[member]: Date.now()
		};
		lock.push(newLock);
		fs.writeFileSync(path.resolve(__dirname, '../lock.json'), JSON.stringify(lock));

		await interaction.reply({ embeds: [embed] });
	} else {
			interaction.reply("This is a guild-only command");
		}
}
}


module.exports = {
	UserCommand
};
