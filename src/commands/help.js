const { Command } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

class UserCommand extends Command {
	/**
	 * @param {Command.Context} context
	 */
	constructor(context) {
		super(context, {
			name: 'help',
			description: 'List all commands'
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
			.setTitle('Command List')
			.setDescription(`A list of commands`)
			.addFields(
				{ name: 'unlock', value: 'Unlocks the Creative Server' },
				{ name: 'status', value: 'Find out who locked the creative server' },
				{ name: 'lock', value: 'Locks the Creative Server' },
				{ name: 'add-marker', value: 'Add a marker to the live map' }
			)
			.setColor('#FF91AF');
		await interaction.reply({ embeds: [embed] });
	}
}

module.exports = {
	UserCommand
};
