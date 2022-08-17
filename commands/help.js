const { setGlobalValidationEnabled } = require("@sapphire/shapeshift");
const { SlashCommandBuilder } = require("discord.js");
const https = require("https");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("A list of commands"),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle("Command List")
      .setDescription(`A list of commands`)
      .addFields(
        { name: "unlock", value: "Unlocks the Creative Server" },
        { name: "status", value: "Find out who locked the creative server" },
        { name: "lock", value: "Locks the Creative Server" }
      );
    await interaction.reply({ embeds: [embed] });
  },
};
