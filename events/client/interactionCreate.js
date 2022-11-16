const { getPasteUrl, PrivateBinClient } = require('@agc93/privatebin');
const { ButtonInteraction, MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
var Ticketnb = 0;
module.exports = {
  name: 'interactionCreate',
  once: false,
  async execute(client, interaction) {
    if (interaction.isCommand() || interaction.isContextMenu()) {
      const cmd = client.commands.get(interaction.commandName);
      if (!cmd) return interaction.reply('Cette commande n\'existe pas!');

      if (cmd.ownerOnly) {
        if (interaction.user.id != ownerId) return message.reply('La seule personne pouvant taper cette commande est l\'owner du bot');
      }

      if (!interaction.member.permissions.has([cmd.permissions])) return interaction.reply({ content: `Vous n'avez pas la/les permission(s) requise(s) (\`${cmd.permissions.join(', ')}\`)pour taper cette commande!`, ephemral: true });

      cmd.runInteraction(client, interaction);
    }
  },
  
};
module.exports = {
  name: 'interactionCreate',
  once: false,
  async execute(client, interaction) {
  const user = interaction.user.id
  if (interaction.isButton()){
    if(interaction.customId === "open-ticket"){
      Ticketnb++;
      


      interaction.guild.channels.create("📘・idaliamc・" + Ticketnb, {
        parent: (process.env.PARENT_OPENED),
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: ["VIEW_CHANNEL"]
          },
          {
            id: interaction.user.id,
            allow: ["VIEW_CHANNEL"]
          },
          {
            id: (process.env.ROLE_SUPPORT),
            allow: ["VIEW_CHANNEL"]
          }
        ]
      }).then(async channel => {
        const embed = new MessageEmbed()
          .setTitle('**Support IdaliaMc**')
          .setColor('6d6ee8')
          .setDescription(`Bonjour ${interaction.user} - ceci est une réponse automatique, merci de répondre à ces questions afin d'être recruté dans la Imsonia :\n➢Depuis combien de temps vous jouez au jeu:\n\n➢Votre pseudonyme en jeu:\n\n➢vos ancien palmarès : (si vous en avez)\n\n➢Qualités / Défauts en jeu :\n\n➢Tes force et faiblesse :\n\n➢As-tu déjà été dans une autre fac ? (si oui laquelle) ?\n\n➢farm ou pvp :\n\n➢Quelles sont t’es disponibilités en général ?\n\n➢Peux-tu stream et record ?\n\n➢La qualités de ton microphone (sur une base de 0 à 10) ?`)
          .setThumbnail("https://cdn.discordapp.com/attachments/922138253170204683/1021110103790866502/logo_black.png")
          .setFooter('Support IdaliaMc')
          .setTimestamp()
        const row = new MessageActionRow()
        .addComponents(new MessageButton()
          .setCustomId('close-ticket')
          .setLabel('Fermer le ticket')
          .setEmoji('🔒')
          .setStyle('DANGER')
        );
      const ping = channel.send(`${interaction.user}`)
      channel.send({
       components: [row], embeds: [embed]
      });
      
      await interaction.reply({ content: `Ticket créé ! <#${channel.id}>`, ephemeral: true });

      });
    }
    if (interaction.customId === "close-ticket") {
      const embed2 = new MessageEmbed()
        .setColor('6d6ee8')
        .setDescription("Es-tu sûr de vouloir fermer le ticket ?")
      const row2 = new MessageActionRow()
      .addComponents(new MessageButton()
        .setCustomId('delete-ticket')
        .setLabel('Oui, j\'en suis sûr')
        .setEmoji('🗑️')
        .setStyle('DANGER')
      )
      .addComponents(new MessageButton()
        .setCustomId('no')
        .setLabel('Non, je ne veux plus')
        .setEmoji('❌')
        .setStyle('SECONDARY')
      );
    interaction.channel.send({
      embeds: [embed2],
      components: [row2],
    });
   }
  }
   if(interaction.customId === "no") {
    const embed3 = new MessageEmbed()
    .setColor('6d6ee8')
    .setDescription("Annulation de la fermeture du ticket")
      interaction.channel.send({
      embeds: [embed3],
      });
  }
   else if(interaction.customId === "delete-ticket") {
    const guild = client.guilds.cache.get(interaction.guildId);
    const chan = guild.channels.cache.get(interaction.channelId);

    chan.edit({
      permissionOverwrites: [
        {
          id: (process.env.ROLE_SUPPORT),
          allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
        },
        {
          id: interaction.guild.id,
          deny: ['VIEW_CHANNEL'],
        },
      ],
    })
      interaction.reply({
        content: 'Sauvegarde des messages...'
      });

      chan.messages.fetch().then(async (messages) => {
        let a = messages.filter(m => m.author.bot !== true).map(m =>
          `${new Date(m.createdTimestamp).toLocaleString('fr-FR')} - ${m.author.username}#${m.author.discriminator}: ${m.attachments.size > 0 ? m.attachments.first().proxyURL : m.content}`
        ).reverse().join('\n');
        if (a.length < 1) a = "Nothing"
        var paste = new PrivateBinClient("https://privatebin.net/");
        var result = await paste.uploadContent(a, {uploadFormat: 'markdown'})
            const embed = new MessageEmbed()
              .setAuthor({name: 'Logs Ticket', iconURL: 'https://cdn.discordapp.com/attachments/922138253170204683/1021110103790866502/logo_black.png'})
              .setDescription(`:id: Ticket ID : \n \`${chan.id}\` \n| :white_check_mark: ouvert par : \n<@!${user}> \n| :lock:  fermé par : \n<@!${interaction.user.id}>\n\n | :open_file_folder: Logs: \n [**Cliquez ici pour voir les logs**](${getPasteUrl(result)})`)
              .setColor('2f3136')
              .setFooter({text: "Les logs de ce ticket seront supprimé dans 6 jours !"})
              .setTimestamp();

            const embed2 = new MessageEmbed()
              .setAuthor({name: 'Logs Ticket', iconURL: 'https://cdn.discordapp.com/attachments/922138253170204683/1021110103790866502/logo_black.png'})
              .setDescription(`📰 Logs du ticket \`${chan.id}\`: [**Cliquez ici pour voir les logs**](${getPasteUrl(result)})`)
              .setColor('2f3136')
              .setFooter({text: "Les logs de ce ticket seront supprimé dans 6 jours !"})
              .setTimestamp();

            client.channels.cache.get(process.env.LOGS_TICKET).send({
              embeds: [embed]
            }).catch(() => console.log("Le salon log ticket n'as pas été trouvé."));
            chan.send('Suppression du salon...');

            setTimeout(() => {
              chan.delete();
            }, 5000);
          });
   }
  }
};
