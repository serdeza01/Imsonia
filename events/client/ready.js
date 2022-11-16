const Logger = require('../../utils/Logger');
const chalk = require('chalk');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    Logger.client('- bot prêt');

    const devGuild = await client.guilds.cache.get('1041744989857779774');
    devGuild.commands.set(client.commands.map(cmd => cmd));
  },
  execute(client) {
    const oniChan = client.channels.cache.get(process.env.TICKET_CHANNEL)

    function sendTicketMSG() {
      const embed = new MessageEmbed()
        .setTitle('**🔗 Recrutement Imsonia**\n')
        .setColor('6d6ee8')
        .setDescription("\n\n:pushpin: **Réagissez avec la réaction ci dessous ( :question: ) afin d'ouvrir un ticket.**\n\n➜ Sans réponse de votre part, le ticket sera **fermé au bout de 24 heures.**\n➜ Répondez à toute les questions de manière détaillée afin que nous puissions vous évaluez dans les meilleures conditions.\n\n:alarm_clock: **Évitez de créer des tickets durant les périodes de faible activité tôt le matin.**")
        .setThumbnail("https://cdn.discordapp.com/attachments/1036130613876502579/1041766273132003468/Sans_titre1.jpg")
        .setFooter('Imsonia')
      const row = new MessageActionRow()
        .addComponents(new MessageButton()
          .setCustomId('open-ticket')
          .setLabel('Ouvrir un ticket.')
          .setEmoji('❓')
          .setStyle('PRIMARY'),
        );

      oniChan.send({
        embeds: [embed],
        components: [row]
      })
    }

    oniChan.bulkDelete(100).then(() => {
      sendTicketMSG()
      console.log(chalk.green('Ticket') + chalk.cyan(' Envoie du widget pour le système de ticket...'))
    })
  },
};
