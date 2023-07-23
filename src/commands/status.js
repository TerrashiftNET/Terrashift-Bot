const { Command } = require('@sapphire/framework');

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
		if (global.user === '') {
			await interaction.reply({ content: 'The creative server is unlocked', ephemeral: true });
		} else {
			await interaction.reply({ content: `The creative server is locked by <@${global.user}>`, ephemeral: true });
		}
	}
}

module.exports = {
	UserCommand
};
