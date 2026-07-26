const { Client, GatewayIntentBits, Partials, PollLayoutType } = require("discord.js");
const cron = require("node-cron");
const fs = require("fs");
const path = require("path");
const config = require("./config.json");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Channel]
});
client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);

  cron.schedule("0 0 * * *", async () => {
    try {
      console.log("Running Wordle Poll job...");

      const guild = await client.guilds.fetch(config.guildId);
      if (!guild) {
        console.error("Guild not found");
        return;
      }

      const channel = await guild.channels.fetch(config.pollChannelId);
      if (!channel) {
        console.error("Poll channel not found. Please set a valid pollChannelId in config.json");
        return;
      }

      await guild.members.fetch();
      const role = await guild.roles.fetch(config.wordleRoleId);
      if (!role) {
        console.error("Wordle role not found. Please set a valid wordleRoleId in config.json");
        return;
      }
      const membersWithRole = role.members;
      if (membersWithRole.size === 0) {
        console.log("No members found with the Wordle role.");
        return;
      }
      const configPath = path.join(__dirname, "config.json");
      let currentConfig = {};
      try {
        if (fs.existsSync(configPath)) {
          currentConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
        } else {
          currentConfig = { ...config };
        }
      } catch (err) {
        console.error("Error reading config.json", err);
        currentConfig = { ...config };
      }

      const lastSelectedId = currentConfig.lastSelectedId || null;
      const eligibleMembers = membersWithRole.filter(member => member.id !== lastSelectedId);
      const candidates = eligibleMembers.size > 0 ? eligibleMembers : membersWithRole;
      const randomMember = candidates.random();

      currentConfig.lastSelectedId = randomMember.id;
      config.lastSelectedId = randomMember.id;
      try {
        fs.writeFileSync(configPath, JSON.stringify(currentConfig, null, 2), "utf-8");
      } catch (err) {
        console.error("Error updating config.json", err);
      }

      const usernameMapPath = path.join(__dirname, "usernameMap.json");
      let usernameMap = {};

      try {
        const mapData = fs.readFileSync(usernameMapPath, "utf-8");
        usernameMap = JSON.parse(mapData);
      } catch (err) {
        console.error("Error reading usernameMap.json", err);
      }
      const mappedName = usernameMap[randomMember.id] || randomMember.displayName;
      const timeFrame = randomMember.id === "730634082631024653" ? "today" : "tomorrow";

      const pinnedMessages = await channel.messages.fetchPinned();

      if (pinnedMessages.size > 0) {
        await pinnedMessages.forEach(async (msg) => {
          await msg.unpin();
        });
      }

      const msg = await channel.send({
        poll: {
          question: { text: `Willl ${mappedName} get the wordle ${timeFrame}?` },
          answers: [
            { text: "Yes (in 6)" },
            { text: "Yes (in 4-5)" },
            { text: "Yes (in 2-3)" },
            { text: "Yes (in 1)" },
            { text: "No (couldn't be Tyler)" }
          ],
          duration: 8,
          allowMultiselect: false,
          layoutType: PollLayoutType.Default
        }
      });
      await msg.pin();
      console.log(`Poll sent successfully for ${mappedName}`);
    } catch (error) {
      console.error("Error running Wordle Poll job:", error);
    }
  }, {
    timezone: "Asia/Kuala_Lumpur"
  });
  console.log("Scheduled Wordle Poll job for 12:00 AM MYT daily.");
});

client.login(config.discord_token);
