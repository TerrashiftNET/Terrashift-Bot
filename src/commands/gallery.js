const { Command } = require('@sapphire/framework');
const fs = require('fs');
const path = require('path');
const https = require('https');

class UserCommand extends Command {
	/**
	 * @param {Command.LoaderContext} context
	 */
	constructor(context) {
		super(context, {
			// Any Command options you want here
			name: 'gallery',
			description: 'Upload an image to be displayed on the terrashift.net gallery'
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
						.setName('season')

						.setDescription('The season of the image')
						.addChoices(
							{
								name: 'Current',
								value: 'current'
							},
							{
								name: 'Season 2',
								value: 's2'
							},
							{
								name: 'Season 3',
								value: 's2'
							},
							{
								name: 'NG',
								value: 'ng'
							}
						)
						.setRequired(true)
				)
				.addAttachmentOption((option) =>
					option //
						.setName('image')
						.setDescription('The image to upload')
						.setRequired(true)
				)
		);
	}

	/**
	 * @param {Command.ChatInputCommandInteraction} interaction
	 */
	async chatInputRun(interaction) {
		const season = interaction.options.getString('season', true);
		const image = interaction.options.getAttachment('image', true);

		const imgurl = image.url;

		console.log(imgurl);

		const filename = path.basename(imgurl).split('?')[0];
		const ext = path.basename(imgurl).split('.').pop();
		// if (!['png', 'jpg', 'jpeg'].includes(ext)) {
		// 	await interaction.reply({
		// 		content: `Only PNG and JPG images are supported!`,
		// 		ephemeral: true
		// 	});
		// 	return;
		// }
		const filepath = path.join(__dirname, `../gallery/${season}/${filename}`);

		const file = fs.createWriteStream(filepath);

		const request = https.get(imgurl, function (response) {
			response.pipe(file);
		});

		await interaction.reply({
			content: `Image uploaded to the gallery!`,
			ephemeral: true
		});
	}
}
module.exports = {
	UserCommand
};
