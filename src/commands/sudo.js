const { Command } = require('@sapphire/framework');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');

class UserCommand extends Command {
    /**
     * @param {Command.Context} context
     */
    constructor(context) {
        super(context, {
            // Any Command options you want here
            name: 'sudo',
            description: 'Sends a message as the bot'
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
                .addChannelOption((option) => option.setName('channel').setDescription('The channel to send the message in').setRequired(true))
                .addStringOption((option) => option.setName('message').setDescription('The message to send').setRequired(true))
                .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
        );
    }

    /**
     * @param {Command.ChatInputCommandInteraction} interaction
     */
    async chatInputRun(interaction) {
        const channel = interaction.options.getChannel('channel');
        const message = interaction.options.getString('message');

        console.log('message:', message);

        if (!message) {
            await interaction.reply({ content: 'The message cannot be empty.', ephemeral: true });
            return;
        }

        await channel.send(message);

        const Embed = new EmbedBuilder()
            .setTitle('New Message')
            .setDescription(`Message sent in ${channel}.`)
            .setColor('#FF0000')
            .addFields({ name: 'Content', value: message, inline: true });

        await interaction.reply({ embeds: [Embed] });
    }
}

module.exports = {
    UserCommand
};