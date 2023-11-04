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
			name: 'farm-protect',
			description: 'Protects restart sensitive farms from breaking '
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
						.setDescription('The dimension of the farm')
						.setRequired(true)
						.addChoices({ name: 'Overworld', value: 'overworld' }, { name: 'Nether', value: 'nether' }, { name: 'End', value: 'end' })
				))
	}

	/**
	 * @param {Command.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
		const x = interaction.options.getInteger('x');
		const y = interaction.options.getInteger('y');
		const z = interaction.options.getInteger('z');
		const dimension = interaction.options.getString('dimension');

		const embed = new EmbedBuilder()
			.setTitle('New Farm Added')
			.setDescription(`The block at ${x}, ${y}, ${z} will be replaced when the server restarts.`);

		// read the current directory for a file called farm-prot.json
		const data = fs.readFileSync('./farm-prot.json');

		const farm = {
			x: x,
			y: y,
			z: z,
			dimension: dimension
		};

		const farms = JSON.parse(data).farms;

		farms.push(farm);

		fs.writeFileSync('./farm-prot.json', JSON.stringify({ farms: farms }));

		await interaction.reply({ embeds: [embed] });
	}
}

module.exports = {
	UserCommand
};
