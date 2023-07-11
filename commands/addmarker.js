const { SlashCommandBuilder } = require("discord.js");
const https = require("https");
const { EmbedBuilder } = require("discord.js");
const { ptero_token, server_id } = require("../config.json");
let data = "";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("addmarker")
    .setDescription("Add a new marker to the livemap")
    .addIntegerOption((option) =>
      option
        .setName("x")
        .setDescription("X coordinate of the marker")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("y")
        .setDescription("Y coordinate of the marker")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("z")
        .setDescription("Z coordinate of the marker")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("dimension")
        .setDescription("The dimension of the marker")
        .setRequired(true)
        .addChoices(
          { name: "Overworld", value: "overworld" },
          { name: "Nether", value: "nether" },
          { name: "End", value: "end" }
        )
    )
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("The name of the marker")
        .setRequired(true)
    ),
  async execute(interaction) {
    const x = interaction.options.getInteger("x");
    const y = interaction.options.getInteger("y");
    const z = interaction.options.getInteger("z");
    const dimension = interaction.options.getString("dimension");
    const name = interaction.options.getString("name");
    const embed = new EmbedBuilder()
      .setTitle("Marker Added")
      .setDescription(
        `Marker added at ${x}, ${y}, ${z} in ${dimension} with the name **${name}**`
      );

    if (dimension === "overworld") {
      data = JSON.stringify({
        command: `bluemap marker create  world ${x} ${y} ${z} ${name}`,
      });
    } else if (dimension === "nether") {
      data = JSON.stringify({
        command: `bluemap marker create 1 nether ${x} ${y} ${z} ${name}`,
      });
    } else if (dimension === "end") {
      data = JSON.stringify({
        command: `bluemap marker create 1 end ${x} ${y} ${z} ${name}`,
      });
    }

    const options = {
      hostname: "admin.terrashift.net",
      path: `/api/client/servers/${server_id}/command`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${ptero_token}`,
      },
    };

    const req = https
      .request(options, (res) => {
        let data = "";

        console.log("Status Code:", res.statusCode);

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {});
      })
      .on("error", (err) => {
        console.log("Error: ", err.message);
      });

    req.write(data);
    req.end();

    await interaction.reply({ embeds: [embed] });
  },
};
