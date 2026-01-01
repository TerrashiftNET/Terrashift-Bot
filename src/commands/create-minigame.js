const { Command } = require("@sapphire/framework");
const { PermissionFlagsBits, EmbedBuilder, time } = require("discord.js");
const { api_secret } = require("../config.json");
const { fetch, FetchResultTypes } = require("@sapphire/fetch");
const { FetchMethods } = require("@sapphire/fetch");
const { Embed } = require("discord.js");
const https = require("https");

class UserCommand extends Command {
  /**
   * @param {Command.Context} context
   */
  constructor(context) {
    super(context, {
      // Any Command options you want here
      name: "create-minigame",
      description: "Rebuild the minigame server with the specified minigame",
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
          option //
            .setName("minigame")

            .setDescription("The minigame you want")
            .addChoices(
              {
                name: "UHC",
                value: "uhc",
              },
              {
                name: "Missile Wars",
                value: "missile-wars",
              },
              {
                name: "Bingo",
                value: "bingo",
              },
            )
            .setRequired(true),
        ),
    );
  }

  /**
   * @param {Command.ChatInputCommandInteraction} interaction
   */
  async chatInputRun(interaction) {
    const minigame = interaction.options.getString("minigame");
    const randomstring = Math.random().toString(36).substring(7);
    const data = JSON.stringify({
      actionId: "4",
      arguments: [
        {
          name: "minigame",
          value: `${minigame}`,
        },
      ],
      uniqueTrackingId: `${randomstring}`,
    });

    const embed = new EmbedBuilder()
      .setTitle("Minigame Server Created")
      .setDescription(
        `${interaction.user.username} created a minigame server for ${minigame}`,
      )
      .setColor("#55ddb2");
    
    const options = {
      hostname: "http://localhost:1337",
      path: "/api",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
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
          console.log("Response: ", JSON.parse(data));
          const Data = JSON.parse(data);
          console.log(Data);
        });
      })
      .on("error", (err) => {
        console.log("Error: ", err.message);
      });

    req.write(data);
    req.end();

    await interaction.reply({ embeds: [embed] });
  }
}

module.exports = {
  UserCommand,
};
