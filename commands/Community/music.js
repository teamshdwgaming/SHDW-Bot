const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, VoiceChannel, GuildEmoji } = require("discord.js");
const client = require("../../index.js")

const status = queue =>
  `Volume: \`${queue.volume}%\` | Filter: \`${queue.filters.names.join(', ') || 'Off'}\` | Loop: \`${
    queue.repeatMode ? (queue.repeatMode === 2 ? 'All Queue' : 'This Song') : 'Off'
  }\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``
client.distube
  .on('playSong', (queue, song) =>
    queue.textChannel.send(
      `${client.emotes.play} | Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${
        song.user
      }\n${status(queue)}`
    )
  )
  .on('addSong', (queue, song) =>
    queue.textChannel.send(
      `${client.emotes.success} | Added ${song.name} - \`${song.formattedDuration}\` to the queue by ${song.user}`
    )
  )
  .on('addList', (queue, playlist) =>
    queue.textChannel.send(
      `${client.emotes.success} | Added \`${playlist.name}\` playlist (${
        playlist.songs.length
      } songs) to queue\n${status(queue)}`
    )
  )

module.exports = {
    data: new SlashCommandBuilder()
    .setName("music")
    .setDescription("Complete music system")
    .addSubcommand(subcommand =>
        subcommand.setName("play")
        .setDescription("Play a song")
        .addStringOption(option =>
            option.setName("query")
            .setDescription("Provide the name or url for the song")
            .setRequired(true)
            )
            )
            .addSubcommand(subcommand =>
                subcommand.setName("volume")
                .setDescription("Adjust the volume of the song")
                .addIntegerOption(option =>
                    option.setName("percent")
                    .setDescription("10 = 10%")
                    .setMinValue(1)
                    .setMaxValue(100)
                    .setRequired(true)
                    )
                    )
                    .addSubcommand(subcommand =>
                        subcommand.setName("options")
                        .setDescription("Select an option")
                        .addStringOption(option =>
                            option.setName("options")
                            .setDescription("Select an option")
                            .setRequired(true)
                            .addChoices(
                                {name: "queue", value: "queue"},
                                {name: "skip", value: "skip"},
                                {name: "pause", value: "pause"},
                                {name: "resume", value: "resume"},
                                {name: "stop", value: "stop"},
                            )
                            )
                            ),
                            async execute(interaction) {
                                const {options, member, guild, channel} = interaction;

                                const subcommand = options.getSubcommand();
                                const query = options.getString("query");
                                const volume = options.getInteger("percent");
                                const option = options.getString("options");
                                const voiceChannel = member.voice.channel;

                                const embed = new EmbedBuilder();

                                if(!voiceChannel) {
                                    embed.setColor("Black").setDescription("You must be in a voice channel to use these commands");
                                    return interaction.reply({ embeds: [embed], ephemeral: true});
                                }

                                if(!member.voice.channelId === guild.members.me.voice.channelId) {
                                    embed.setColor("Black").setDescription(`You can't use the music commands as it is already in <#${guild,members.me.voice.channelId}>`);
                                    return interaction.reply({ embeds: [embed], ephemeral: true});
                                }

                                try {
                                    switch (subcommand) {
                                        case "play":
                                        client.distube.play(voiceChannel, query, { textChannel: channel, member: member });
                                        return interaction.reply({ content: " :notes: Request recieved"});
                                        case "volume":
                                            client.distube.setVolume(voiceChannel, volume);
                                            return interaction.reply({ content: `:sound: Volume has been set to ${volume}%`});
                                            case "settings":
                                                const queue = await client.distube.getQueue(voiceChannel);

                                                if(!queue) {
                                                    embed.setColor("Black").setDescription("There is no active queue");
                                                    return interaction.reply({ embeds: [embed], ephemeral: true})
                                                }

                                                switch(option) {
                                                    case "skip":
                                                        await queue.skip(voiceChannel);
                                                        embed.setColor("Black").setDescription(" :fast_forward: The song has been skipped");
                                                        return interaction.reply({ embeds: [embed], ephermeral: true})
                                                        case "stop":
                                                        await queue.stop(voiceChannel);
                                                        embed.setColor("Black").setDescription(" :stop_button: The queue has been stopped");
                                                        return interaction.reply({ embeds: [embed], ephermeral: true})
                                                        case "pause":
                                                        await queue.pause(voiceChannel);
                                                        embed.setColor("Black").setDescription(" :pause_button: The song has been paused");
                                                        return interaction.reply({ embeds: [embed], ephemeral: true})
                                                        case "resumed":
                                                        await queue.pause(voiceChannel);
                                                        embed.setColor("Black").setDescription(" :arrow_forward: The song has been resumed");
                                                        return interaction.reply({ embeds: [embed], ephemeral: true})
                                                        case "queue":
                                                            embed.setColor("Black").setDescription(`${queue.songs.map(
                                                                (song, id) => `\n**${id +1}. ** ${song.name} -\`${song.formattedDuration}\``
                                                            )}`);
                                                            return interaction.reply({ embeds: [embed], ephemeral: true});
                                                }
                                    }
                                } catch(err) {
                                    console.log(err);

                                    embed.setColor("Black").setDescription("Something went wrong")

                                    return interaction.reply({ embeds: [embed], ephemeral: true})
                                }
                            }
}