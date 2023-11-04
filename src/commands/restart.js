const { EmbedBuilder } = require('@discordjs/builders');
const { Command } = require('@sapphire/framework');
const { PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const { creative_server_id, server_id, ptero_token, api_url } = require('../config.json');
const https = require('https');
const Nodeactyl = require('nodeactyl');
const client = new Nodeactyl.NodeactylClient(api_url, ptero_token);
const wait = require('node:timers/promises').setTimeout;

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

		const farmsData = JSON.parse(data);

		await interaction.reply({ embeds: [new EmbedBuilder().setTitle('Replacing blocks...').setDescription(`Preparing to restart by placing blocks and waiting 30 seconds`)]})

		await Promise.all(
			
			farmsData.farms.map(async (farm, index) => {
				const location = {
					x: farm.x,
					y: farm.y,
					z: farm.z,
					dimension: farm.dimension
				};
				console.log(location);

				if ((location.dimension = 'nether')) {
					var command = `execute in minecraft:the_nether run setblock ${location.x} ${location.y} ${location.z} redstone_block`;
				} else if ((location.dimension = 'end')) {
					var command = `execute in minecraft:the_end run setblock ${location.x} ${location.y} ${location.z} redstone_block`;
				} else if ((location.dimension = 'overworld')) {
					var command = `execute in minecraft:overworld run setblock ${location.x} ${location.y} ${location.z} redstone_block`;
				} else {
					await interaction.editReply(`Invalid dimension in farm ${index}`);
				}

				await client.sendServerCommand(server_id, command);
			})
	)
		
		wait(3000);

		await client.restartServer(creative_server_id)
			.then(result => {
				const embed = new EmbedBuilder().setTitle('Server Restarted').setDescription(`Server is restarting`);
				interaction.editReply({ embeds: [embed] });
		})
	}
}

module.exports = {
	UserCommand
};
