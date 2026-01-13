const { SlashCommandBuilder, PollLayoutType, PermissionsBitField } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('votação').setDescription('Inicia uma nova votação no server').addStringOption((option) => option.setName('título').setDescription('Título da votação').setRequired(true)),
	async execute(interaction) {
	    const client = interaction.client;

		const respostas = [];

		const guild = client.guilds.cache.get("1099927577604411462");

		guild.members.cache.forEach(user => {
			if (!user.user.bot) {
				respostas.push({text: `${user.displayName}`});
			}
		});

	    const channel = client.channels.cache.get('1458866822961954909');

		if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))
	    	return;

	    channel.send({
		poll: {
		    question: { text: interaction.options.getString("título") },
		    answers: respostas,
		    allowMultiselect: false,
		    duration: 4,
		    layoutType: PollLayoutType.Default,
		}
	    });

	    interaction.reply('Votação iniciada!');
	},
};
