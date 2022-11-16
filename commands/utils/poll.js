const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'poll',
  category: 'utils',
  permissions: ['ADMINISTRATOR'],
  ownerOnly: false,
  usage: 'poll [question]',
  examples: ['poll', 'poll Quelle heure est-il?'],
  description: 'Poster votre propre sondage!',
  async run(client, message, args) {
    if (!args[0]) return message.reply('Merci d\'entrer du contenu pour votre sondage!')

    const embed = new MessageEmbed()
      .setTitle('Sondage')
      .setColor('#00a3b5')
      .setDescription(args.slice(0).join(' '))
      .setTimestamp()
      .setFooter({ text: `Nouveau sondage généré par ${message.author.tag}!` });


    const poll = await message.reply({ embeds: [embed] });
    poll.react('👍');
    poll.react('❌')
  },
  options: [
    {
      name: 'title',
      description: 'Ecriver le titre de votre sondage',
      type: 'STRING',
      required: true,
    },
    {
      name: 'content',
      description: 'Ecriver la question de votre sondage',
      type: 'STRING',
      required: true,
    }
  ],
  async runInteraction(client, interaction) {
    const pollTitle = interaction.options.getString('title');
    const pollContent = interaction.options.getString('content');

    const embed = new MessageEmbed()
      .setTitle(pollTitle)
      .setColor('#00a3b5')
      .setDescription(pollContent)
      .setTimestamp()
      .setFooter({ text: `Nouveau sondage généré par ${interaction.user.tag}!` });


    const poll = await interaction.reply({ embeds: [embed], fetchReply: true });
    poll.react('👍');
    poll.react('❌')
  },
};
