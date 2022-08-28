const { SlashCommandBuilder } = require("discord.js");
const https = require("https");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("addmarker")
    .setDescription("Add a new marker to the livemap")
    .addIntegerOption((option) =>
      option.setName("X").setDescription("X coordinate of the marker")
    )
    .addIntegerOption((option) =>
      option.setName("X").setDescription("Z coordinate of the marker")
    ),
  async execute(interaction) {},
};
