const { Command } = require("@sapphire/framework");
const { EmbedBuilder } = require("discord.js");
const { PaginatedMessage } = require("@sapphire/discord.js-utilities");
const fs = require("fs");
const path = require("path");

class UserCommand extends Command {
  /**
   * @param {Command.Context} context
   */
  constructor(context) {
    super(context, {
      name: "help",
      description: "List all commands",
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
    const paginatedMessage = new PaginatedMessage()

    paginatedMessage.addPageEmbed((embed) => embed.setColor("#55ddb2").setTitle("Command List").setDescription(`A list of commands`).addFields(
      { name: "help", value: "Show this message" },
      {
        name: "gallery",
        value:
          "Upload an image to be displayed on the terrashift.net gallery",
      },
      {
        name: "creative-op",
        value: "Make yourself an operator on the creative server",
      },
    ))

    paginatedMessage.addPageEmbed((embed) => embed.setColor("#55ddb2").setTitle("Command List").setDescription(`A list of commands`).addFields(
      { name: "unlock", value: "Unlock the Creative Server" },
      { name: "lock", value: "Lock the Creative Server" },
      { name: "status", value: "Find out who locked the creative server" },
    ))

    await paginatedMessage.run(interaction)
  }
} 

module.exports = {
  UserCommand,
};
