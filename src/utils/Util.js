function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }
function _asyncToGenerator2(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }
function _asyncToGenerator3(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }
function _asyncToGenerator4(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }
function _asyncToGenerator5(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }
function _asyncToGenerator6(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }
function _asyncToGenerator7(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

const Bot = require("../structures/Bot");
const Config = require("../../Config");
const Winston = require("./Winston");
const { RoleModel, ChannelModel } = require("../models/Model");
const { setTimeout: sleep } = require('node:timers/promises');
const { ChannelType, GatewayIntentBits } = require('discord-api-types/v10');
const { Client, Intents } = require('discord.js');
const logger = require('node-color-log');
const fs = require('fs');

module.exports = class Util {
  constructor(bot = Bot) {
    this.bot = bot;
    this.dist = [];
    const configData = this.readConfig();
    this.SAFE_BOTS = configData.SafeBots || [];
    this.SAFE_USERS = configData.SafeUsers || [];
  }

  readConfig() {
    try {
      const configFile = fs.readFileSync('config.json', 'utf8');
      return JSON.parse(configFile);
    } catch (error) {
      logger.error('Config dosyasını okurken bir hata oluştu:', error.message);
      return {};
    }
  }

  sleep(ms) {
    return _asyncToGenerator3(function* () {
      return yield sleep(ms);
    })();
  }

  catchUsers(guild, Id) {
    return _asyncToGenerator3(function* () {
      guild.bans.create(Id).catch(function () {
        return new Promise(function () {});
      });
    })();
  }

  secureIds(Id) {
    var _this3 = this;

    return _asyncToGenerator3(function* () {
      const guild = _this3.bot.guilds.cache.get(Config.GUILD_ID);
      if (!guild) return false;

      const member = guild.members.resolve(Id);
      if (!member) return false;

      if (!member || member.id === _this3.bot.application.id || _this3.SAFE_BOTS.indexOf(member.id) !== -1 || _this3.SAFE_USERS.indexOf(member.id) !== -1) return true;
      return false;
    })();
  }

  loginToSup() {
    for (const TOKEN of Config.TOKENS) {
      const newSub = new Client({
        intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
      });
  
      newSub.on("ready", () => {
        // Her bir alt botun durumunu burada ayarlayabilirsiniz
        newSub.user.setPresence({
          activities: [{
            name: Config.Presence,
            type: "WATCHING",
          }],
          status: "online",
        });
  
        this.dist.push(newSub);
      });
  
      newSub.login(TOKEN);
    }
  }

  getBackup() {
    var _this5 = this;

    return _asyncToGenerator7(function* () {
      var guild = _this5.bot.guilds.cache.get(Config.GUILD_ID);
      if (!guild || guild.roles.cache.size == 0 && guild.channels.cache.size == 0) return false;

      guild.roles.cache.sort(function (x, y) {
        return x.id - y.id;
      }).filter(function (role) {
        return !role.managed && role.editable && role.id != guild.id;
      }).each((() => {
        var ref = _asyncToGenerator7(function* (query) {
          if (query.members.size <= 0) return;

          yield RoleModel.updateOne({ id: query.id }, { $set: { members: query.members.map(function (member) {
                return member.id;
              }) } }, { upsert: true }).exec();
        });

        return function (_x2) {
          return ref.apply(this, arguments);
        };
      })());

      guild.channels.cache.sort(function (x, y) {
        return x.id - y.id;
      }).filter(function (channel) {
        return !channel.isThread();
      }).each((() => {
        var ref = _asyncToGenerator7(function* (query) {
          yield ChannelModel.updateOne({ id: query.id }, { $set: {
              id: query.id,
              type: query.type,
              parent: query.parentId ? query.parentId : "",
              permissionOverwrites: query.permissionOverwrites.cache.map(function (permission) {
                return {
                  id: permission.id,
                  type: permission.type,
                  allow: permission.allow.toArray(),
                  deny: permission.deny.toArray()
                };
              })
            } }, { upsert: true }).exec();
        });

        return function (_x6) {
          return ref.apply(this, arguments);
        };
      })());

      new Winston().info("Backup retrieved again");
    })();
  }

  getAuditLogs(role, action, filter) {
    let guild = role;

    return new Promise(resolve => {
      (() => {
        var ref = _asyncToGenerator2(function* (iter) {
          let logs = yield guild.fetchAuditLogs({ limit: 10, type: action });
          let entries = logs.entries;
          let entry = null;
          entries = entries.filter(filter);

          for (var e of entries) if (!entry || e[0] > entry.id) entry = e[1];

          if (entry) return resolve(entry);
          if (++iter === 5) return resolve(null);else return setTimeout(search, 200, iter);
        });

        function search(_x3) {
          return ref.apply(this, arguments);
        }

        return search;
      })()(0);
    });
  }

  beforeChannels(channel) {
    return _asyncToGenerator3(function* () {
      var newChannel;

      newChannel = yield channel.edit({
        name: channel.name,
        type: channel.type,
        topic: channel.topic,
        nsfw: channel.nsfw,
        bitrate: channel.bitrate,
        userLimit: channel.userLimit,
        lockPermissions: channel.lockPermissions,
        permissionOverwrites: channel.permissionOverwrites.cache,
        rateLimitPerUser: channel.rateLimitPerUser,
        defaultAutoArchiveDuration: channel.defaultAutoArchiveDuration,
        rtcRegion: channel.rtcRegion
      });
    })();
  }
  
  beforeRoles(oldRole, newRole) {
    return _asyncToGenerator3(function* () {
      yield newRole.edit({
        name: oldRole.name,
        color: oldRole.color,
        hoist: oldRole.hoist,
        permissions: oldRole.permissions,
        mentionable: oldRole.mentionable
      });
    })();
  }

  cloneChannels(channel, types) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      var newChannel;

      if (types == ChannelType.GuildText) {
        newChannel = yield channel.guild.channels.create(channel.name, {
          type: channel.type,
          topic: channel.topic,
          nsfw: channel.nsfw,
          permissionOverwrites: channel.permissionOverwrites.cache
        });

        if (channel.parent) newChannel.setParent(channel.parent);
        newChannel.setPosition(channel.rawPosition);
        ChannelModel.findOneAndUpdate({ id: channel.id }, { $set: { id: newChannel.id } }).exec((() => {
          var ref = _asyncToGenerator5(function* (e, deps) {
            if (e) console.log(e);
          });

          return function (_x7, _x8) {
            return ref.apply(this, arguments);
          };
        })());
      }

      if (types == ChannelType.GuildVoice) {
        newChannel = yield channel.guild.channels.create(channel.name, {
          type: channel.type,
          bitrate: channel.bitrate,
          userLimit: channel.userLimit,
          defaultAutoArchiveDuration: channel.defaultAutoArchiveDuration,
          rtcRegion: channel.rtcRegion,
          rateLimitPerUser: channel.rateLimitPerUser,
          permissionOverwrites: channel.permissionOverwrites.cache
        });

        if (channel.parent) newChannel.setParent(channel.parent);
        newChannel.setPosition(channel.rawPosition);
        ChannelModel.findOneAndUpdate({ id: channel.id }, { $set: { id: newChannel.id } }).exec((() => {
          var ref = _asyncToGenerator5(function* (e, deps) {
            if (e) console.log(e);
          });

          return function (_x9, _x10) {
            return ref.apply(this, arguments);
          };
        })());
      }

      if (types == ChannelType.GuildCategory) {
        newChannel = yield channel.guild.channels.create(channel.name, {
          type: channel.type,
          permissionOverwrites: channel.permissionOverwrites.cache
        });
        newChannel.setPosition(channel.rawPosition);
        
        ChannelModel.find({ parent: channel.id }, (() => {
          var ref = _asyncToGenerator(function* (error, document) {
            ChannelModel.updateMany({ parent: channel.id }, { $set: { parent: newChannel.id } }).exec((() => {
              var ref = _asyncToGenerator5(function* (e, deps) {
                if (e) console.log(e);
              });

              return function (_x11, _x12) {
                return ref.apply(this, arguments);
              };
            })());
            for (var sort of document.sort(function (x, y) {
              delete require.cache[sort];
              return x.id > y.id ? 1 : -1;
            })) {
              var parentChannel = yield _this2.bot.channels.cache.get(sort.id);
              if (!parentChannel) return;
              _asyncToGenerator(function* () {
                delete require.cache[parentChannel];
                return yield parentChannel.setParent(newChannel, { lockPermissions: false });
              })();
            }
          });

          return function (_x4, _x5) {
            return ref.apply(this, arguments);
          };
        })());
      }
    })();
  }

  cloneRoles(role) {
    var _this4 = this;

    return _asyncToGenerator4(function* () {
      var newRole;

      newRole = yield role.guild.roles.create({
        name: role.name,
        color: role.color,
        hoist: role.hoist,
        permissions: role.permissions,
        mentionable: role.mentionable
      });
      newRole.setPosition(role.rawPosition);

      var updateModel = yield RoleModel.findOneAndUpdate({ id: role.id }, { id: newRole.id }, { new: true });
      yield ChannelModel.updateMany({ "permissionOverwrites.id": role.id }, { $set: { "permissionOverwrites.$.id": newRole.id } }, { new: true });

      ChannelModel.find({ "permissionOverwrites.id": newRole.id }, (() => {
        var ref = _asyncToGenerator5(function* (error, doc) {
          for (var overwrite of doc) {
            var channel = role.guild.channels.cache.get(overwrite.id);
            if (channel) yield channel.edit({ permissionOverwrites: overwrite.permissionOverwrites }).catch(function () {
              return new Promise(function () {});
            });
            yield sleep(1000);
          }
        });

        return function (_x15, _x16) {
          return ref.apply(this, arguments);
        };
      })());


        return function (_x13, _x14) {
          return ref.apply(this, arguments);
        };
    })();
  }
};
