const { SlashCommandBuilder, PollLayoutType, PermissionsBitField } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder().setName('votação').setDescription('Inicia uma nova votação no server').addStringOption((option) => option.setName('título').setDescription('Título da votação').setRequired(true)),
	async execute(interaction) {
		if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))
	    	return;

	    const client = interaction.client;

		const respostas = [];

		const guild = client.guilds.cache.get("1099927577604411462");

		guild.members.cache.forEach(user => {
			if (!user.user.bot) {
				respostas.push({text: `${user.displayName}`});
			}
		});

	    const channel = client.channels.cache.get('1458866822961954909');
		const title = interaction.options.getString("título");

		channel.send({content: "Nova votação iniciada! <@1460603564178149528>"})

	    createPoll(channel, respostas, title, 1);
	},
};

async function createPoll (channel, respostas, title, round) {
	var message = await channel.send({
		poll: {
			question: { text: title + " (Round " + round + ")" },
			answers: respostas,
			allowMultiselect: false,
			duration: 5,
			layoutType: PollLayoutType.Default,
		}
	});

	setTimeout(async () => {
		await message.poll.end();
		let respostasPoll = message.poll.answers;

		let respostasOrdenadas = [];

		respostasPoll.each((resposta, key) => {
			let respostaAtual = [respostas[key-1], resposta];
			if (respostasOrdenadas.length == 0) {
				respostasOrdenadas[0] = respostaAtual;
			} else {

				for (let i = 0; i < respostasOrdenadas.length; i++) {
					if (respostaAtual[1] > respostasOrdenadas[i][1]) {
						let respostaTemp = respostaAtual;
						respostaAtual = respostasOrdenadas[i];
						respostasOrdenadas[i] = respostaTemp;
					}
				}

				respostasOrdenadas[respostasOrdenadas.length] = respostaAtual;
			}
		});

		let respostasRound2 = [];

		let status;

		if (respostas.length == 10) {
			status = 0;
		} else if (respostas.length >= 5) {
			status = 1;
		} else if (respostas.length < 5 && respostas.length > 2) {
			status = 2;
		} else {
			status = 3;
		}

		if (status != 3) {

			for (let i = 0; i < status == 0 ? 5 : status == 1 ? (int)(respostas.length / 2) : 2; i++) {
				console.log(respostasOrdenadas[i]);
			}

			createPoll(channel, respostasRound2, title, round++);
		} else {
			channel.send({content: "O(A) ganhador(a) foi: " + respostasOrdenadas[0][0].text});
		}

	}, 10000);
}
