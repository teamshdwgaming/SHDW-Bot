const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('member-count')
    .setDescription('Replys with the servers member count'),
    async execute(interaction) {

      const embed = new EmbedBuilder()
      .setColor("Black")
      .setDescription(`This server has ${interaction.guild.memberCount} members`)

      await interaction.reply({ embeds: [embed] })
    }
}