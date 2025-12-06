const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { Command } = require("@sapphire/framework");
const { server_id, ptero_token, api_url } = require("../config.json");
const https = require("https");
const Nodeactyl = require("nodeactyl");
const client = new Nodeactyl.NodeactylClient(api_url, ptero_token);

class UserCommand extends Command {
  /**
   * @param {Command.Context} context
   */
  constructor(context) {
    super(context, {
      // Any Command options you want here
      name: "refresh-skin",
      description: "Clear player cache on the main server",
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
            .setName("username")
            .setDescription("The username of the user to refresh the skin of")
            .setRequired(true),
        ),
    );
  }

  /**
   * @param {Command.ChatInputCommandInteraction} interaction
   */
  async chatInputRun(interaction) {
    const username = interaction.options.getString("username");

    const embed = new EmbedBuilder()
      .setTitle(`Skin cache cleared`)
      .setDescription(
        `Skin cache for ${username} cleared. Your skin should now be refreshed.`,
      );

    var command = `pfc clean ${username}`;

    await client.sendServerCommand(server_id, command);

    await interaction.reply({ embeds: [embed] });
  }
}

module.exports = {
  UserCommand,
};
