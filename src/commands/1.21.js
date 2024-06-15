const { Command } = require('@sapphire/framework');
const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { curseforgeApiKey } = require('../config.json');
const { ModrinthV2Client } = require('@xmcl/modrinth');
const { Curseforge } = require('node-curseforge');
const mods = JSON.parse(fs.readFileSync(path.join(__dirname, '../mods.json'), 'utf8'));
const client = new ModrinthV2Client();
let cf = new Curseforge(curseforgeApiKey);

class UserCommand extends Command {
	/**
	 * @param {Command.LoaderContext} context
	 */
	constructor(context) {
		super(context, {
			// Any Command options you want here
			name: 'update-check',
			description: 'List mods for 1.21'
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
		);
	}

	/**
	 * @param {Command.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
		// Initialize an empty array to hold mod status messages
		let mod_status = [];

		// Process each mod asynchronously using Promise.all to wait for all to complete
		await Promise.all(
			mods.map(async (mod) => {
				if (mod.source === 'curseforge') {
					try {
						const addon = await cf.get_mod(mod.id);
						if (addon.latestFiles[0].gameVersions[0].includes('1.21')) {
							mod_status.push(`✅- Mod ${addon.name} has a 1.21 version`);
						} else {
							mod_status.push(`❌-Mod ${addon.name} does not have a 1.21 version`);
						}
					} catch (err) {
						console.error(err);
					}
				} else if (mod.source === 'modrinth') {
					try {
						const data = await client.getProject(mod.id);
						if (data.game_versions.includes('1.21')) {
							mod_status.push(`✅- Mod ${data.title} has a 1.21 version`);
						} else {
							mod_status.push(`❌- Mod ${data.title} does not have a 1.21 version`);
						}
					} catch (err) {
						console.error(err);
					}
				}
			})
		);

		// Write the final mod_status array to the 1.21.json file
		fs.writeFileSync(path.join(__dirname, '../1.21.json'), JSON.stringify(mod_status, null, 2));

		// sort the array by mod status
		mod_status.sort();

		// Create an embed with the mod status messages
		const embed = new EmbedBuilder().setTitle('Mods for 1.21').setDescription(`${mod_status.join('\n')}`);

		// Reply with the embed
		await interaction.reply({ embeds: [embed] });
	}
}

module.exports = {
	UserCommand
};
