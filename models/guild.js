const moongose = require ('mongoose');

const guildSchema = moongose.Schema({
  id : String,
  prefix: { 'type': String, 'default': '!' },
  logChannel: { 'type': String, 'default': '1041761719128703081' }
});

module.exports = moongose.model('guild', guildSchema);