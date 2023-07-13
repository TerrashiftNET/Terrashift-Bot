const { EmbedBuilder } = require('@discordjs/builders');
const { Command } = require('@sapphire/framework');
const fs = require('fs');
const { server_id, ptero_token } = require('../config.json');
const https = require('https');

class UserCommand extends Command {
	/**
	 * @param {Command.Context} context
	 */
	constructor(context) {
		super(context, {
			// Any Command options you want here
			name: 'add-marker',
			description: 'Add a new marker to the livemap'
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
				.addIntegerOption((option) =>
					option //
						.setName('x')
						.setDescription('X coordinate')
						.setRequired(true)
				)
				.addIntegerOption((option) =>
					option //
						.setName('y')
						.setDescription('Y coordinate')
						.setRequired(true)
				)
				.addIntegerOption((option) =>
					option //
						.setName('z')
						.setDescription('Z coordinate')
						.setRequired(true)
				)
				.addStringOption((option) =>
					option
						.setName('dimension')
						.setDescription('The dimension of the marker')
						.setRequired(true)
						.addChoices({ name: 'Overworld', value: 'overworld' }, { name: 'Nether', value: 'nether' }, { name: 'End', value: 'end' })
				)
				.addStringOption((option) => option.setName('name').setDescription('The name of the marker').setRequired(true))
		);
	}

	/**
	 * @param {Command.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
		const x = interaction.options.getInteger('x');
		const y = interaction.options.getInteger('y');
		const z = interaction.options.getInteger('z');
		const dimension = interaction.options.getString('dimension');
		const name = interaction.options.getString('name');

		const embed = new EmbedBuilder()
			.setTitle('New Marker')
			.setDescription(`Added a new marker at ${x}, ${y}, ${z} in the ${dimension} dimension.`);

		if (fs.readFileSync('./markers.json').toString() !== '{}') {
			var markers = JSON.parse(fs.readFileSync('./markers.json').toString());
			var last_id = markers.last_id;
			var random_id = last_id + 1;
		} else {
			var random_id = 1;
		}
		var step_1 = JSON.stringify({
			command: `bmarker create poi`
		});

		var step_2 = JSON.stringify({
			command: `bmarker-setup id ${random_id}`
		});

		var step_3 = JSON.stringify({
			command: `bmarker-setup label ${name}`
		});

		var step_4 = JSON.stringify({
			command: `bmarker-setup position ${x} ${y} ${z}`
		});

		var step_5 = JSON.stringify({
			command: `bmarker-setup marker_set 1_terrashift-${dimension}`
		});

		var step_6 = JSON.stringify({
			command: `bmarker-setup build`
		});

		const commands = [step_1, step_2, step_3, step_4, step_5, step_6];

		const options = {
			hostname: 'admin.terrashift.net',
			path: `/api/client/servers` + server_id + `/command`,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				Authorization: `Bearer ${ptero_token}`
			}
		};

		for (const command of commands) {
			const req = https.request(options, (res) => {
				console.log(`statusCode: ${res.statusCode}`);

				res.on('data', (d) => {
					process.stdout.write(d);
				});
			});

			req.on('error', (error) => {
				console.error(error);
			});

			req.write(command);
			req.end();
		}
	}
}

module.exports = {
	UserCommand
};
