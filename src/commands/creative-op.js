const { EmbedBuilder, PermissionFlagsBits } = require('@discordjs/builders');
const { Command } = require('@sapphire/framework');
const { creative_server_id, ptero_token, api_url } = require('../config.json');
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
			name: 'creative-op',
			description: 'Make someone an operator on the creative server'
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
				.addStringOption((option) =>
					option
						.setName('username')
						.setDescription('The username of the user to op')
						.setRequired(true)
				)
			        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
		);
	}

	/**
	 * @param {Command.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
		const username = interaction.options.getString('username');

		const embed = new EmbedBuilder()
			.setTitle(`User Op'd`)
			.setDescription(`${username}`);
	
		var command = `op ${username}`;
		
		await client.sendServerCommand(creative_server_id, command);

		await interaction.reply({ embeds: [embed] });
	}
}

module.exports = {
	UserCommand
};
