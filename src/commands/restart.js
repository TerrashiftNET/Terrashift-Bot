const { EmbedBuilder } = require('@discordjs/builders');
const { Command } = require('@sapphire/framework');
const { PermissionFlagsBits } = require('discord.js');
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
			name: 'restart',
			description: 'Restart the main server.'
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
				.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		);
	}

	/**
	 * @param {Command.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
		const data = fs.readFileSync('./farm-prot.json');

		const farms = JSON.parse(data).farms
		
		farms.forEach((farm, index) => {
			const location = {
				x: farm.x,
				y: farm.y,
				z: farm.z,
				dimension: farm.dimension
			};

			if ((dimension = 'nether')) {
				var command = `execute in minecraft:the_nether run setblock ${location.x} ${location.y} ${location.z} redstone_block`;
			} else if ((dimension = 'end')) {
				var command = `execute in minecraft:the_end run setblock ${location.x} ${location.y} ${location.z} redstone_block`;
			} else {
				var command = `execute in minecraft:overworld run setblock ${location.x} ${location.y} ${location.z} redstone_block`;
			}

			await client.sendServerCommand(server_id, command);
		});

		const embed = new EmbedBuilder().setTitle('Test result').setDescription(`Test successful `);

		await interaction.reply({ embeds: [embed] });
	}
}

module.exports = {
	UserCommand
};
