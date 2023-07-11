const { SlashCommandBuilder } = require("discord.js");
const https = require("https");
const { EmbedBuilder } = require("discord.js");
const {
  ptero_token,
  creative_server_id,
  schedule_id,
} = require("../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unlock")
    .setDescription("Unlocks the Creative Server"),
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle("Creative Server Unlocked")
      .setDescription(
        `Creative Server has been unlocked by <@${interaction.user.id}>`
      );
    await interaction.reply({ embeds: [embed] });
    const data = JSON.stringify({
      name: "Creative Reset",
      is_active: true,
      minute: "0",
      hour: "0",
      day_of_month: "*",
      day_of_week: "*",
      month: "*/12",
    });

    const options = {
      hostname: "admin.terrashift.net",
      path: `/api/client/servers/${creative_server_id}/schedules/3`,
      path: encodeURIComponent(
        "/api/client/servers/" +
          creative_server_id +
          "/schedules/" +
          schedule_id
      ),
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

        res.on("end", () => {
          console.log("Body: ", JSON.parse(data));
        });
      })
      .on("error", (err) => {
        console.log("Error: ", err.message);
      });

    req.write(data);
    req.end();
    global.user = "";
  },
};
