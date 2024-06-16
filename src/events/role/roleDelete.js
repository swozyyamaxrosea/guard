function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const Bot = require("../../structures/Bot");
const Event = require("../../structures/Event");
const logger = require('node-color-log');
const Config = require("../../../Config.json");

module.exports = class RoleDeleteEvent extends Event {
  constructor(bot = Bot) {
    super(bot, "roleDelete");
  }

  exec(bot = Bot, role) {
    return _asyncToGenerator(function* () {
      const entry = yield bot.util.getAuditLogs(role.guild, "ROLE_DELETE", function (entries) {
        return entries.target.id === role.id && entries.createdTimestamp > Date.now() - 1000 * 60;
      });
      if (!entry || (yield bot.util.secureIds(entry.executor.id))) return;

      bot.danger = true;
      bot.util.catchUsers(role.guild, entry.executor.id);
      bot.util.cloneRoles(role);
      logger.warn(`${entry.executor.tag} bir rol sildi ve rolü oluşturup o kişiyi sunucudan banladım!`);
      const message = `🛡️ (\`${entry.executor.tag}\`), isimli kullanıcı bir rol sildi ve rolü oluşturup o kişiyi sunucudan banladım!`;

      const guardLogChannel = role.guild.channels.cache.get(Config.GuardLog);
      if (guardLogChannel) {
        guardLogChannel.send(message);
      } else {
        logger.error('Guard Log kanalı bulunamadı!');
      }
    })();
  }
};