const { Client, Collection, MessageEmbed, MessageActionRow, MessageButton, MessageAttachment } = require('discord.js');
const dotenv = require('dotenv'); dotenv.config();
const mongoose = require('mongoose');
const client = new Client({ intents: 515 });
const Logger = require('./utils/Logger');
const fs = require('fs');
const chalk = require('chalk');
const config = require('./config.json');
const { getPasteUrl, PrivateBinClient } = require('@agc93/privatebin');
const { channel } = require('diagnostics_channel');
const Canvas = require('canvas');

client.commands = new Collection();


const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
};

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
    client.on(event.name, (...args) => event.execute(...args, client));
};

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction, client, config);
  } catch (error) {
    console.error(error);
    return interaction.reply({
      content: 'Erreur vérifié le code !',
      ephemeral: true
    });
  };
});


["commands", "buttons"].forEach(
  (x) => (client[x] = new Collection())
);

["CommandUtil", "EventUtil", "ButtonUtil"].forEach((handler) => {
  require(`./utils/handlers/${handler}`)(client);
});


process.on('exit', code => { Logger.client(`Le processus c'est arrêté avec le code: ${code}!`) });

process.on('uncaughtException', (err, origin) => { 
  Logger.error(`UNCAUGHT_EXCEPTION: ${err}`);
  console.error( `Origine: ${origin}`);
});

process.on('unhandledRejection', (reason, promise) => { 
  Logger.warn(`UNHANDLED_REJECTION: ${reason}`);
  console.log(promise); 
});

process.on('warning', (...args) => Logger.warn(...args));

mongoose.connect(process.env.DATABASE_URI, {
  autoIndex: false, // Don't build indexes
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4 // Use IPv4, skip trying IPv6
}).then(() => { console.log('Le client est connecté à la base de données!') })
.catch(err => { console.log(err) });

client.login(process.env.DISCORD_TOKEN);