const { Command } = require('@sapphire/framework');
const { ApplicationCommandType, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

const MESSAGE_TIMEOUT = 60000;
const DEFAULT_PERMISSIONS = PermissionFlagsBits.ManageMessages;

class EditMessageCommand extends Command {
	constructor(context) {
		super(context, {
			name: 'Edit Message'
		});
	}

	registerApplicationCommands(registry) {
		registry.registerContextMenuCommand((builder) =>
			builder //
				.setName('Edit Message')
				.setType(ApplicationCommandType.Message)
				.setDefaultMemberPermissions(DEFAULT_PERMISSIONS)
		);
	}

	async contextMenuRun(interaction) {
		try {
			const message = await interaction.guild.channels.cache.get(interaction.channelId).messages.fetch(interaction.targetId);
			const oldContent = message.content;

			if (!message) {
				await interaction.reply({ content: 'The message could not be found.', ephemeral: true });
				return;
			}

			if (message.author.id !== interaction.client.user.id) {
				await interaction.reply({ content: 'This message was not created by the bot.', ephemeral: true });
				return;
			}

			const dm = await interaction.user.createDM();
			await interaction.reply({ content: 'Please check your DMs.', ephemeral: true });
			await dm.send({ content: 'What would you like the new content to be?' });

			const response = await dm.awaitMessages({ max: 1, time: MESSAGE_TIMEOUT, errors: ['time'] });
			const newContent = response.first().content;

			await message.edit(newContent.replace(/\\n/g, '\n'));

			const changes = new EmbedBuilder()
				.setTitle('Message Edited')
				.setDescription(`Message edited by ${interaction.user.tag}`)
				.addFields([
					{ name: 'Old Content', value: oldContent},
					{ name: 'New Content', value: newContent }
				])
				.setTimestamp(new Date());

			await interaction.editReply({ content: 'The Message has been Edited.', ephemeral: true });
			await dm.send({ embeds: [changes] });
		} catch (error) {
			await interaction.reply({ content: 'An error occurred while editing the message.', ephemeral: true });
		}
	}
}

module.exports = {
	EditMessageCommand
};
