
import Discord from 'discord.js';

export default class extends Command {
  constructor(options) {
    super(options);
    this.description = "A fun game";
    this.permissions = {
      user: [0, 0],
      bot: [0, 16384]
    }
  }
  async run(bot, message, args) {
    if (!args[1]) return await message.reply("Please enter a full question with 2 or more words!");

    const replies = [
      "Yes",
      "No",
      "I don't know",
      "Ask again later!",
      "Cyka",
      "I am not sure!",
      "Please No",
      "You tell me",
      "Without a doubt",
      "Cannot predict now",
    ];

    const result = Math.floor(Math.random() * replies.length);
    const question = args.slice(1).join(" ");

    const ballembed = new Discord.MessageEmbed()
      .setAuthor(message.author.username)
      .setColor("RANDOM")
      .addField("Question", question)
      .addField("Answer", replies[result]);

    await message.channel.send(ballembed);
  }
}