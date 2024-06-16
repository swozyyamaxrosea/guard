const Bot = require("../../structures/Bot");
const Event = require("../../structures/Event");
const logger = require('node-color-log');
const Config = require("../../../Config.json");

module.exports = class RoleUpdateEvent extends Event {
  constructor(bot = Bot) {
    super(bot, "roleUpdate");
  }

  async exec(bot = Bot, oldRole, newRole) {
    try {
      const entry = await bot.util.getAuditLogs(newRole.guild, "ROLE_UPDATE", function (entries) {
        return entries.target.id === newRole.id || entries.createdTimestamp < (Date.now() - 5000);
      });

      if (!entry || await bot.util.secureIds(entry.executor.id)) return;

      bot.util.catchUsers(newRole.guild, entry.executor.id);
      bot.util.beforeRoles(oldRole, newRole);
      
      logger.warn(`${entry.executor.tag} bir rol güncelledi ve rolü eski haline getirip o kişiyi sunucudan banladım!`);
      const message = `🛡️ (\`${entry.executor.tag}\`), isimli kullanıcı bir rol güncelledi ve rolü eski haline getirip o kişiyi sunucudan banladım!`;

      const guardLogChannel = newRole.guild.channels.cache.get(Config.GuardLog);
      if (guardLogChannel) {
        guardLogChannel.send(message);
      } else {
        logger.error('Guard Log kanalı bulunamadı!');
      }
    } catch (error) {
      console.error(`Rol güncellenirken hata oluştu: ${error}`);
    }
  }
};
