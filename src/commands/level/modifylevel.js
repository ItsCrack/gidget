const Levels = require("../../utils/discord-xp");
const MessageModel = require("../../database/models/levelconfig");

module.exports = {
  run: async (bot, message, args) => {
    if (!message.guild) return message.channel.send("This command only works in servers");
    if (!message.member.hasPermission("ADMINISTRATOR")) {
      if (message.guild.id === "312846399731662850" && message.author.id !== "577000793094488085") {
        return message.channel.send("You do not have permission to use this command!");
      }
    }
    const msgDocument = await MessageModel.findOne({ guildId: message.guild.id })
    if (!msgDocument) return message.channel.send("The levels on this server are disabled! Use `togglelevel level` to enable the system!")
    if (msgDocument && !msgDocument.levelsystem) return message.channel.send("The levels on this server are disabled! Use `togglelevel level` to enable the system!")
    const target = message.mentions.members.first() || message.guild.members.cache.get(args[1]) || await (args[1] ? await message.guild.members.fetch(args[1]).catch(err => { }) : undefined);
    if (target) {
      if (target.user.bot) return message.reply('why do you want to configure the level of a bot?');
      const waiting = await Levels.fetch(target.id, message.guild.id);
      if (!waiting) {
        Levels.createUser(target.id, message.guild.id);
        return message.reply('That user isn\'t on my database');
      }
      switch (args[2]) {
        case "subtract":
          if (!args[3]) return message.reply('specify a amount');
          let num1 = parseInt(args[3])
          if (!num1) return message.reply('invalid number!');
          if (num1 < 0) return message.reply('invalid number!');
          Levels.subtractXp(target.id, message.guild.id, num1).then(() => message.channel.send(`Ok, I've subtracted ${num1}xp from ${target.user.tag}.`)).catch(err => message.channel.send('Some error ocurred! Here\'s a debug: ' + err));
          break;
        case "subtractlevel":
          if (!args[3]) return message.reply('specify a amount');
          let num2 = parseInt(args[3])
          if (!num2) return message.reply('invalid number!');
          if (num2 < 0) return message.reply('invalid number!');
          Levels.subtractLevel(target.id, message.guild.id, num2).then(() => message.channel.send(`Ok, I've lowered ${num2} levels to ${target.user.tag}.`)).catch(err => message.channel.send('Some error ocurred! Here\'s a debug: ' + err));
          break;
        case "setlevel":
          if (!args[3]) return message.reply('specify a amount');
          let num3 = parseInt(args[3])
          if (typeof num3 !== "number" && !num3) return message.reply('invalid number!');
          if (num3 < 0) return message.reply('invalid number!');
          Levels.setLevel(target.id, message.guild.id, num3).then(() => message.channel.send(`Ok, I've put ${target.user.tag} on level ${num3}`)).catch(err => message.channel.send('Some error ocurred! Here\'s a debug: ' + err));
          break;
        case "appendlevel":
          if (!args[3]) return message.reply('specify a amount');
          let num4 = parseInt(args[3])
          if (!num4) return message.reply('invalid number!');
          if (num4 < 0) return message.reply('invalid number!');
          Levels.appendLevel(target.id, message.guild.id, num4).then(() => message.channel.send(`Ok, I've increased ${num4} levels to ${target.user.tag}`)).catch(err => message.channel.send('Some error ocurred! Here\'s a debug: ' + err));
          break;
        case "appendxp":
          if (!args[3]) return message.reply('specify a amount');
          let num5 = parseInt(args[3])
          if (!num5) return message.reply('invalid number!');
          if (num5 < 0) return message.reply('invalid number!');
          Levels.appendXp(target.id, message.guild.id, num5).then(() => message.channel.send(`Ok, I've increased ${num5}xp to ${target.user.tag}`)).catch(err => message.channel.send('Some error ocurred! Here\'s a debug: ' + err));
          break;
        case "setxp":
          if (!args[3]) return message.reply('specify a amount');
          let num6 = parseInt(args[3])
          if (typeof num6 !== "number" && !num6) return message.reply('invalid number!');
          if (num6 < 0) return message.reply('invalid number!');
          Levels.setXp(target.id, message.guild.id, num6).then(() => message.channel.send(`Ok, I've put ${target.user.tag}'s XP to ${num6}xp`)).catch(err => message.channel.send('Some error ocurred! Here\'s a debug: ' + err));
          break;
        case "delete":
          Levels.deleteUser(args[1], message.guild.id).then(() => message.channel.send(`Ok, I've removed that user from my database.`)).catch(err => message.channel.send('Some error ocurred! Here\'s a debug: ' + err));
          break;
        default:
          message.reply("invalid argument!");
          break;
      };
    } else {
      if (args[2] === "delete") {
        Levels.deleteUser(args[1], message.guild.id).then(() => message.channel.send(`Ok, I've removed that user from my database.`)).catch(err => message.channel.send('Some error ocurred! Here\'s a debug: ' + err));
      } else if (args[2] && target) {
        message.reply("invalid argument!");
      } else if (!args[1]) {
        message.reply("Put some arguments!");
      } else if (args[1] || !target) {
        message.reply("Invalid user!");
      }
    }
  },
  aliases: ["ml"],
  description: "Modify the levels"
}