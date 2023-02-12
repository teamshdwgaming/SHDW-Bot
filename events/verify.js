const { Interaction, EmbedBuilder } = require('discord.js')

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.isButton()) {
            if (interaction.customId === 'verify') {
                const role = interaction.guild.roles.cache.get('1026030742922330143')
                interaction.member.roles.add(role)
                
                const DMembed = new EmbedBuilder()
                    .setTitle(`Verified`)
                    .setDescription(`You have now been verified, see the rules :)`)
                    .setFooter({ text: `Rules` })
                    .setTimestamp()
                    .setColor('Grey')
                interaction.reply({ embeds: [DMembed], ephemeral: true })
            }
        }
    }
}