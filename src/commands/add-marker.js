const { EmbedBuilder } = require('@discordjs/builders');
const { Command } = require('@sapphire/framework');
const fs = require('fs');
const { server_id, ptero_token, api_url } = require('../config.json');
const https = require('https');
const Nodeactyl = require('nodeactyl');
const client = new Nodeactyl.NodeactylClient(api_url, ptero_token);

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

		// read the current directory for a file called markers.json
		const data = fs.readFileSync('./markers.json');

		// get the last id from the file
		const last_id = JSON.parse(data).last_id;
		// generate a new id
		const random_id = last_id + 1;

		var step_1 = `bmarker create poi`;

		var step_2 = `bmarker-setup id ${random_id}`;

		var step_3 = `bmarker-setup label ${name}`;

		var step_4 = `bmarker-setup position ${x} ${y} ${z}`;

		var step_5 = `bmarker-setup marker_set 1-${dimension}`;

		var step_6 = `bmarker-setup build`;

		const commands = [step_1, step_2, step_3, step_4, step_5, step_6];

		const marker = {
			id: random_id,
			name: name,
			x: x,
			y: y,
			z: z,
			dimension: dimension
		};

		for (const command of commands) {
			await client.sendServerCommand(server_id, command);
		}

		const markers = JSON.parse(data).markers;

		markers.push(marker);

		fs.writeFileSync('./markers.json', JSON.stringify({ markers: markers, last_id: random_id }));

		await interaction.reply({ embeds: [embed] });
	}
}

module.exports = {
	UserCommand
};
