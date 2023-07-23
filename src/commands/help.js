const { Command } = require('@sapphire/framework');
const fs = require('fs');
const { EmbedBuilder } = require('@discordjs/builders');

class UserCommand extends Command {
	/**
	 * @param {Command.Context} context
	 */
	constructor(context) {
		super(context, {
			// Any Command options you want here
			name: 'help',
			description: 'Get a list of commands you can use'
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
		// loop over the command files and get their name and description from the constructor
		const commands = [];
		const commandFiles = fs.readdirSync('./src/commands').filter((file) => file.endsWith('.js'));

		for (const file of commandFiles) {
			const command = require(`./${file}`);
			commands.push({ name: command.name, value: command.description });
		}

		console.log(commands);

		// create the embed
		const embed = new EmbedBuilder().setTitle('Help').setDescription('Here is a list of commands you can use').addFields(commands);
	}
}

module.exports = {
	UserCommand
};
