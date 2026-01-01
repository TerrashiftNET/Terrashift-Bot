const { Command } = require("@sapphire/framework");
const { EmbedBuilder } = require("discord.js");
const https = require("https");
const {
  ptero_token,
  creative_server_id,
  schedule_id,
} = require("../config.json");
const fs = require("fs");
const path = require("path");

class UserCommand extends Command {
  /**
   * @param {Command.Context} context
   */
  constructor(context) {
    super(context, {
      // Any Command options you want here
      name: "lock",
      description:
        "Lock the creative server and prevent it from being overwritten",
    });
  }

  /**
   * @param {Command.Registry} registry
   */
  registerApplicationCommands(registry) {
    registry.registerChatInputCommand((builder) =>
      builder //
        .setName(this.name)
        .setDescription(this.description),
    );
  }

  /**
   * @param {Command.ChatInputCommandInteraction} interaction
   */
  async chatInputRun(interaction) {
    if (interaction.inGuild()) {
      const member = interaction.user.id;
      const lockPath = path.join(__dirname, "../lock.json");
      // if lock.json doesn't exist, create it
      if (!fs.existsSync(lockPath)) {
        fs.writeFileSync(
          lockPath,
          JSON.stringify(
            { users: [], first_locked: null, next_update: null },
            null,
            2,
          ),
        );
      }

      const lock = JSON.parse(fs.readFileSync(lockPath, "utf8"));

      if (lock.first_locked == null || lock.users.length == 0) {
        lock.first_locked = Date.now();
      }

      const embed = new EmbedBuilder()
        .setTitle("Creative Server Locked")
        .setDescription(
          `Creative Server has been locked by <@${interaction.user.id}>, it will no longer be overwritten` +
            ` \n \nCreative server has been locked since: <t:${Math.floor(lock.first_locked / 1000)}:f>`,
      )
      .setColor("#55ddb2");

      const data = JSON.stringify({
        name: "Creative Reset",
        is_active: false,
        minute: "0",
        hour: "0",
        day_of_month: "*",
        day_of_week: "*",
        month: "*/12",
      });

      const options = {
        hostname: "admin.terrashift.net",
        path:
          "/api/client/servers/" +
          creative_server_id +
          "/schedules/" +
          schedule_id,
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
            const Data = JSON.parse(data);
            const lock = JSON.parse(
              fs.readFileSync(path.resolve(__dirname, "../lock.json"), "utf8"),
            );
            const date = new Date(Data.attributes.next_run_at);
            const unixTimestamp = date.getTime();
            lock.next_update = unixTimestamp;
            fs.writeFileSync(
              path.resolve(__dirname, "../lock.json"),
              JSON.stringify(lock, null, 2),
            );
          });
        })
        .on("error", (err) => {
          console.log("Error: ", err.message);
        });

      req.write(data);
      req.end();

      // if the user is already in lock.json, return
      if (lock.users.some((user) => Object.keys(user)[0] == member)) {
        await interaction.reply({
          content: "You have already locked the creative server",
          ephemeral: true,
        });
        return;
      }

      //append the user and the current unix timestamp to lock.json
      const newLock = { [member]: Date.now() };
      lock.users.push(newLock); // Push to the array

      if (lock.users.length === 1) {
        if (lock.next_update <= Date.now()) {
          lock.first_locked = Date.now();
        }
      }

      fs.writeFileSync(lockPath, JSON.stringify(lock, null, 2)); // Write back to the file

      await interaction.reply({ embeds: [embed] });
    } else {
      interaction.reply("This is a guild-only command");
    }
  }
}

module.exports = {
  UserCommand,
};
