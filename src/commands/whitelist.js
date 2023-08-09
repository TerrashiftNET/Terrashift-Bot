const { Command } = require('@sapphire/framework');
const { PermissionFlagsBits } = require('discord.js');
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
			name: 'whitelist',
			description: 'whitelist a user on the server'
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
				.addStringOption((option) => option.setName('name').setDescription('The username to whitelist').setRequired(true))
				.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		);
	}

	/**
	 * @param {Command.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
		const username = interaction.options.getString('name');

		client
			.sendServerCommand(server_id, 'whitelist add ' + username)
			.then((response) => {
				interaction.reply('Added ' + username + ' to the whitelist');
			})
			.catch((error) => {
				interaction.reply('Error adding ' + username + ' to the whitelist');
			});
	}
}

module.exports = {
	UserCommand
};
