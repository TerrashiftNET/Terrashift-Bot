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

    if(interaction.member.roles.cache.has("297333355819696130")) {
      paginatedMessage.addPageEmbed((embed) => embed.setColor("#55ddb2").setTitle("Command List").setDescription(`A list of commands`).addFields(
        { name: "update-check", value: "List mods for the specified version" },
        { name: "sudo", value: "Send a message as the bot" },
        { name: "edit-message", value: "Edit a message sent by the bot" },
      ))
      paginatedMessage.addPageEmbed((embed) => embed.setColor("#55ddb2").setTitle("Command List").setDescription(`A list of commands`).addFields(
        { name: "whitelist", value: "Whitelist a user on the server" },
        { name: "create-minigame", value: "Rebuild the minigame server with the specified minigame" },
        { name: "check-app", value: "Fetch details about a users application" },
      ))
    }

    await paginatedMessage.run(interaction)
  }
} 

module.exports = {
  UserCommand,
};
