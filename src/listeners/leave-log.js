const { Listener } = require('@sapphire/framework');
const { api_secret, admin_channel_id } = require('../config.json');
const { EmbedBuilder} = require('discord.js');

class UserEvent extends Listener {
	/**
	 * @param {Listener.LoaderContext} context
	 */
	constructor(context) {
		super(context, {
			once: false,
			event: 'guildMemberRemove'
		});
	}

	async run(client) {
		console.log(client)
		const { username } = client.user;
		const guild  = "902150268920139806"

		console.log(`User ${username} has left the server.`);
		
		const response = await fetch(`https://apply.terrashift.net/discord/${username}`, {
			headers: {
				'X-Api-Key': api_secret
			}
		});

		var mcname = response.username;

		// check if discord is undefined
		if (!mcname) {
			mcname = "Not Found"
		}

		const embed = new EmbedBuilder()
			.setTitle(`User ${username} has left the server.`)
			.setDescription(`Details for ${username}`)
			.addFields(
				{ name: 'Discord', value: `${username}` },
				{ name: 'MC Username', value: `${mcname}` }
			)
		const channel = await client.guild.channels.cache.get(admin_channel_id);
		channel.send({ embeds: [embed] });
	}

}

module.exports = {
	UserEvent
}
