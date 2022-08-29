const { SlashCommandBuilder } = require("discord.js");
const https = require("https");
const { EmbedBuilder } = require("discord.js");

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
      path: "/api/client/servers/513e3db7/schedules/3",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization:
          "Bearer ptlc_4DP7GdrpAJlcugLnpH5LIWzGg8cyyeqS7mw1n58gp27",
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
