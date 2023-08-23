const { Command } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');
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
			name: 'unlock',
			description: 'Unlock the creative server and allow it to be overwritten'
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
		const data = JSON.stringify({
			name: 'Creative Reset',
			is_active: true,
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

		const member = interaction.user.id;
		// read lock.json and remove member from it

		// [{ '297333355819696130': 1692829214422 }, { '297333355819696130': 1692829223321 }];

		const lock = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../lock.json'), 'utf8'));
		const index = lock.findIndex((obj) => Object.keys(obj)[0] == member);
		lock.splice(index, 1);

		fs.writeFileSync(path.resolve(__dirname, '../lock.json'), JSON.stringify(lock));

		if (lock.length == 0) {
			const embed = new EmbedBuilder()
				.setTitle('Creative Server Unlocked')
				.setDescription(`Creative Server has been unlocked by <@${interaction.user.id}>, it can now be overwritten`);

			const req = https.request(options, (res) => {
				let data = '';

				res.on('data', (chunk) => {
					data += chunk;
				});

				res.on('end', () => {
					console.log(JSON.parse(data));
				});
			});

			req.write(data);
			req.end();

			await interaction.reply({ embeds: [embed] });
		} else {
			const embed = new EmbedBuilder()
				.setTitle('Creative Server is still locked by:')
				.setDescription(`<@${lock.map((obj) => Object.keys(obj)[0]).join('>\n <@')}>`)
				.setColor('#FF91AF');

			await interaction.reply({ embeds: [embed] });
		}
	}
}

module.exports = {
	UserCommand
};
