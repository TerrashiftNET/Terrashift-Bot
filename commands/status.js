const { SlashCommandBuilder } = require("discord.js");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("status")
    .setDescription("Find out who locked the creative server"),
  async execute(interaction) {
    if (global.user === "") {
      await interaction.reply("Creative Server is unlocked");
    } else {
      const embed = new EmbedBuilder()
        .setTitle("Creative Server Status")
        .setDescription(`Creative Server has been locked by <@${global.user}>`);
      await interaction.reply({ embeds: [embed] });
    }
  },
};
