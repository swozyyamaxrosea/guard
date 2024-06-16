const mongoose = require("mongoose");

const ChannelSchema = new mongoose.Schema(
  {
    id: { type: String, unique: true, required: true },
    type: { type: Number, enum: [0, 2, 4], required: true }, // 0: GUILD_TEXT, 2: GUILD_VOICE, 4: GUILD_CATEGORY
    parent: { type: String, default: null },
    permissionOverwrites: { 
      type: [{
        id: String,
        type: String,
        allow: Array,
        deny: Array
      }],
      default: []
    },
  },
  { collection: "Channel", minimize: false }
);

const RoleSchema = new mongoose.Schema(
  {
    id: { type: String, unique: true, required: true },
    members: { type: [String], default: [] }, // members alanı artık string dizisi olmalı
  },
  { collection: "Role", minimize: false }
);

const ChannelModel = mongoose.model("Channel", ChannelSchema);
const RoleModel = mongoose.model("Role", RoleSchema);

module.exports = {
  ChannelModel,
  RoleModel,
};
