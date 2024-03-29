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
			// Any Command options you want here
			name: 'status',
			description: 'Check if the creative server is unlocked or not'
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
		var embed;
		const lock = JSON.parse(fs.readFileSync(path.join(__dirname, '../lock.json'), 'utf8'));
		console.log(lock.length)
		if (lock.length === 0) {
			embed = new EmbedBuilder()
				.setTitle('The Creative Server is currently unlocked and is due to be overwritten at')
				.setDescription(`12am GMT`)
				.setColor('#FF91AF');
		} else {
			embed = new EmbedBuilder()
				.setTitle('The Creative Server is currently locked by:')
				.setDescription(`<@${lock.map((obj) => Object.keys(obj)[0]).join('>\n <@')}>`)
				.setColor('#FF91AF');
		}
		await interaction.reply({ embeds: [embed] });
	}
}

module.exports = {
	UserCommand
};
