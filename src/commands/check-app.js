const { Command } = require("@sapphire/framework");
const { PermissionFlagsBits, EmbedBuilder, time } = require("discord.js");
const { api_secret } = require("../config.json");
const { fetch, FetchResultTypes } = require("@sapphire/fetch");
const { FetchMethods } = require("@sapphire/fetch");

class UserCommand extends Command {
  /**
   * @param {Command.Context} context
   */
  constructor(context) {
    super(context, {
      // Any Command options you want here
      name: "check-app",
      description: "Fetch details about a users application",
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
            .setName("name")
            .setDescription("The username to check")
            .setRequired(true),
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    );
  }

  /**
   * @param {Command.ChatInputCommandInteraction} interaction
   */
  async chatInputRun(interaction) {
    const user = interaction.options.getString("name");

    // make an api request to https://apply.terrashift.net/user/<username>, passing the api_secret in the headers
    const data = await fetch(
      `https://apply.terrashift.net/user/${user}`,

      {
        method: FetchMethods.Get,
        headers: {
          "X-Api-Key": api_secret,
        },
      },
      FetchResultTypes.JSON,
    );

    if (!data) {
      return interaction.reply({
        content: "An error occurred while fetching the user.",
        ephemeral: true,
      });
    }

    console.log(data);

    // if the user does not exist, return an error
    if (!data) {
      return interaction.reply({
        content: "The user does not exist.",
        ephemeral: true,
      });
    }

    // create an embed with the user's details
    const embed = new EmbedBuilder()
      .setTitle("User Details")
      .setDescription(`Details for ${user}`)
      .addFields([
        { name: "Username", value: user, inline: true },
        { name: "Discord", value: data.discord, inline: true },
        { name: "Age", value: data.age, inline: true },
        { name: "Email", value: data.email, inline: true },
        { name: "Reason", value: data.reason, inline: true },
        { name: "Looking for", value: data.looking_for, inline: true },
      ])
      .setFooter({
        text: new Date(Number(data.timestamp)).toUTCString(),
        icon: interaction.guild.iconURL,
      });

    // reply with the embed
    await interaction.reply({ embeds: [embed] });
  }
}

module.exports = {
  UserCommand,
};
