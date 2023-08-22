const { Command } = require('@sapphire/framework');
const { EmbedBuilder } = require('@discordjs/builders');
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
		// loop over all files in the commands folder
		const commandFiles = fs.readdirSync(path.join(__dirname, '../commands')).filter((file) => file.endsWith('.js'));
		// import the name and description of each command
		// name and description are defined in the constructor of each command
		const commands = [];
		for (const file of commandFiles) {
			console.log(file)
			const { UserCommand } = require(`../commands/${file}`);
			const instance = new UserCommand(this.options);
			console.log(instance.name);
		}
		// create an embed with the name and description of each command
		const embed = new EmbedBuilder()
			.setTitle('Commands')
			.setDescription(commands.map((command) => `**${command.name}** - ${command.description}`).join('\n'));
		// send the embed
		await interaction.reply({ embeds: [embed], ephemeral: true });
	}
}

module.exports = {
	UserCommand
};
