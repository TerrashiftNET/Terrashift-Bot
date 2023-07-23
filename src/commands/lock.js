const { Command } = require('@sapphire/framework');
const { EmbedBuilder } = require('@discordjs/builders');
const https = require('https');
const { ptero_token, creative_server_id, schedule_id } = require('../config.json');

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
		global.user = member;

		await interaction.reply({ embeds: [embed] });
	}
}

module.exports = {
	UserCommand
};
