const { SlashCommandBuilder} = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require(`discord.js`);

module.exports = {
    data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('This is the help command'),
    async execute (interaction, client) {

        const embed = new EmbedBuilder()
        .setColor("Black")
        .setTitle("Help Center")
        .setDescription(`Help Command Guide:`)
        .addFields({ name: "Page 1", value: "Help & Resources (page1)"})
        .addFields({ name: "Page 2", value: "Community Commands (page2)"})
        .addFields({ name: "Page 3", value: "Moderation Commands (page3)"})

        const embed2 = new EmbedBuilder()
        .setColor("Black")
        .setTitle("Community Commands")
        .addFields({ name: "/help", value: "Do /help for the commands list & support"})
        .addFields({ name: "/member-count", value: "Do /member-count to view the amount of members"})
        .addFields({ name: "/serverinfo", value: "Do /serverinfo to view everything about the server"})
        .addFields({ name: "/socials", value: "Do /socials to view Scout's socials"})
        .addFields({ name: "/suggest", value: "Do /suggest to suggest something to me(SHDW Bot) or the website"})
        .addFields({ name: "/uptime", value: "Do /uptime to see how long I've been online"})
        .addFields({ name: "/userinfo", value: "Do /userinfo to get the info about a user"})
        .addFields({ name: "/report", value: "Use /report to report a bug in the server"})
        .addFields({ name: "/shdwsub", value: "Do /shdwsubto send a subbmission for the team"})
        .setFooter({ text: "Community Commands"})
        .setTimestamp()

        const embed3 = new EmbedBuilder()
        .setColor("Black")
        .setTitle("Moderation Commands")
        .addFields({ name: "/clear", value: "Do /clear to clear a certain amount of messages"})
        .addFields({ name: "/ban", value: "Do /ban to ban a user from the server"})
        .addFields({ name: "/kick", value: "Do /kick to kick a member from the server"})
        .addFields({ name: "/timeout", value: "Do /timeout to timeout a user for a duration"})
        .addFields({ name: "/verify", value: "Do /verify to add our welcome verify to chat"})
        .addFields({ name: "/ruleverify", value: "Do /ruleverify to show the rules in chat"})
        .addFields({ name: "announce", value: "Do /announce to announce something to the server"})
        .addFields({ name: "ticket-setup and ticket-disable", value: "Do this to enable and disble th etciket system"})
        .addFields({ name: "/warn, /warnings, and /clearwarn", value: "Warn peopole, check warnings, and clear warns"})
        .setFooter({ text: "Moderation Commands"})
        .setTimestamp()

        const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId("page1")
            .setLabel("Page 1")
            .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
            .setCustomId("page2")
            .setLabel("Page 2")
            .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
            .setCustomId("page3")
            .setLabel("Page 3")
            .setStyle(ButtonStyle.Success),
        )

        const message = await interaction.reply({ embeds: [embed], components: [button] })
        const collector = await message.createMessageComponentCollector();

        collector.on('collect', async i => {
            
            if (i.customId === 'page1') {
                
                if(i.user.id !== interaction.user.id) {
                    return await i.reply({ content: `Only ${interaction.user.tag} can use these buttons!`, ephemeral: true})
                }
                await i.update({ embeds: [embed], components: [button] })
            }

            if (i.customId === 'page2') {
                
                if(i.user.id !== interaction.user.id) {
                    return await i.reply({ content: `Only ${interaction.user.tag} can use these buttons!`, ephemeral: true})
                }
                await i.update({ embeds: [embed2], components: [button]})
            }

            if (i.customId === 'page3') {
                
                if(i.user.id !== interaction.user.id) {
                    return await i.reply({ content: `Only ${interaction.user.tag} can use these buttons!`, ephemeral: true})
                }
                await i.update({ embeds: [embed3], components: [button]})
            }
        })
    }

}