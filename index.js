const { ChannelType, ButtonStyle, ButtonBuilder, ActionRowBuilder, TextInputStyle, ModalBuilder, Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField, Permissions, MessageManager, Embed, Collection, Events, TextInputBuilder, PermissionFlagsBits } = require(`discord.js`);
const fs = require('fs');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates] });
const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");

client.distube = new DisTube(client, {
    emitNewSongOnly: true,
    leaveOnFinish: true,
    emitAddSongWhenCreatingQueue: false,
    plugins: [new SpotifyPlugin()]
});

  module.exports = client;

client.commands = new Collection();

require('dotenv').config();

const functions = fs.readdirSync("./src/functions").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./src/events").filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands");

(async () => {
    for (file of functions) {
        require(`./functions/${file}`)(client);
    }
    client.handleEvents(eventFiles, "./src/events");
    client.handleCommands(commandFolders, "./src/commands");
    client.login(process.env.token)
})();


client.on('ready', () => {
    const activities = [
        
      { name: `/help`, type: 0 }, // LISTENING
      
          { name: `The Team SHDW Discord Server`, type: 2 }, // PLAYING
          { name: `Team SHDW's Users`, type: 3 }, // WATCHING
      ];
      const status = [
          'online'
      ];
      let i = 0;
      setInterval(() => {
          if(i >= activities.length) i = 0
          client.user.setActivity(activities[i])
          i++;
      }, 5000);
    
      let s = 0;
      setInterval(() => {
          if(s >= activities.length) s = 0
          client.user.setStatus(status[s])
          s++;
      }, 10000);
  });

  client.on(Events.InteractionCreate, async interaction => {

    if (!interaction.isModalSubmit()) return;
  
    if (interaction.customId === 'modal') {
      const ingameusername = interaction.fields.getTextInputValue('ingameusername');
      const aboutyou = interaction.fields.getTextInputValue('aboutyou');
      const whyshdw = interaction.fields.getTextInputValue('whyshdw');
      const priorteam = interaction.fields.getTextInputValue('priorteam');
      const gametheyplay = interaction.fields.getTextInputValue('gametheyplay');
  
      const dmEmbed = new EmbedBuilder()
        .setColor("Black")
        .addFields({ name: `${interaction.user.username}'s SHDW Sub form`, value: `${ingameusername}`})
        .addFields({ name: "About", value: `${aboutyou}` })
        .addFields({ name: "Why Team member", value: `${whyshdw}` })
        .addFields({ name: "Prior Experience", value: `${priorteam}` })
        .addFields({ name: "The game they want to play", value: `${gametheyplay}` })
  
      const me = client.users.cache.get("718718225000693760")
  
      me.send({ embeds: [dmEmbed] })
      await interaction.reply({ content: 'Your form has been submitted.', ephemeral: true })
    }
  })


const ticketSchema = require('./Schemas.js/ticketSchema');
client.on(Events.InteractionCreate, async interaction => {

    if (interaction.isButton()) return;
    if (interaction.isChatInputCommand()) return;

    const ticketmodal = new ModalBuilder()
    .setTitle('Provide us with more info')
    .setCustomId('ticketmodal')

    const email = new TextInputBuilder()
    .setCustomId('email')
    .setRequired(true)
    .setLabel('Provide us with your email')
    .setPlaceholder(`You must provide a valid email`)
    .setStyle(TextInputStyle.Short)

    const username = new TextInputBuilder()
    .setCustomId('username')
    .setRequired(true)
    .setLabel('Provide us with your username')
    .setPlaceholder(`This is your username`)
    .setStyle(TextInputStyle.Short)

    const reason = new TextInputBuilder()
    .setCustomId('reason')
    .setRequired(true)
    .setLabel('The reason for this ticket')
    .setPlaceholder(`Give us a reason for opening this ticket`)
    .setStyle(TextInputStyle.Paragraph)

    const firstActionRow = new ActionRowBuilder().addComponents(email)
    const secondActionRow = new ActionRowBuilder().addComponents(username)
    const thirdActionRow = new ActionRowBuilder().addComponents(reason)
    
    ticketmodal.addComponents(firstActionRow, secondActionRow, thirdActionRow)
    let choices;
    if (interaction.isStringSelectMenu()) {

        choices = interaction.values;

        const result = choices.join('');

        ticketSchema.findOne({ Guild: interaction.guild.id}, async (err, data) => {

            const filter = {Guild: interaction.guild.id};
            const update = {Ticket: result};

            ticketSchema.updateOne(filter, update, {
                new: true
            }).then(value => {
                console.log(value)
            })
        })
    }

    if (!interaction.isModalSubmit()) {
        interaction.showModal(ticketmodal)
    }
})

client.on(Events.InteractionCreate, async interaction => {

    if (interaction.isModalSubmit()) {

        if (interaction.customId === 'ticketmodal') {

            ticketSchema.findOne({ Guild: interaction.guild.id}, async (err, data) => {

                const emailInput = interaction.fields.getTextInputValue('email')
                const usernameInput = interaction.fields.getTextInputValue('username')
                const reasonInput = interaction.fields.getTextInputValue('reason')

                const postChannel = await interaction.guild.channels.cache.find(c => c.name === `ticket-${interaction.user.id}`);
                if (postChannel) return await interaction.reply({ content: `You already have a ticket open - ${postChannel}`, ephemeral: true});

                const category = data.Channel;

                const embed = new EmbedBuilder()
                .setColor("Black")
                .setTitle(`${interaction.user.username}'s Ticket`)
                .setDescription(` Welcome to your ticket! Please wait while staff review your info`)
                .addFields({ name: `Email`, value: `${emailInput}`})
                .addFields({ name: `Username`, value: `${usernameInput}`})
                .addFields({ name: `Reason`, value: `${reasonInput}`})
                .addFields({ name: `Type`, value: `${data.Ticket}`})
                .setFooter({ text: `${interaction.guild.name} tickets`})

                const button = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId('ticketbutton')
                    .setLabel(`Close Ticket`)
                    .setStyle(ButtonStyle.Danger)
                )


                let channel = await interaction.guild.channels.create({
                    name: `ticket-${interaction.user.tag}`,
                    type: ChannelType.GuildText,
                    parent: `${category}`,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.roles.everyone,
                            deny: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                        },
                        {
                            id: interaction.user,
                            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
                        },
                    ],
                })

                let msg = await channel.send({ embeds: [embed], components: [button]});
                await interaction.reply({ content: `Your ticket has been opened in ${channel}`, ephemeral: true});

                const collector = msg.createMessageComponentCollector()

                collector.on('collect', async i => {
                    ;(await channel).delete();


                    const dmEmbed = new EmbedBuilder()
                    .setColor("Black")
                    .setTitle(`Your ticket has been closed`)
                    .setDescription(`Thanks for contacting us! If you need anything else, feel free to open another one`)
                    .setFooter({ text: `${interaction.guild.name} tickets`})
                    .setTimestamp()

                    await interaction.member.send({ embeds: [dmEmbed]}).catch (err => {
                        return;
                    })

                })

            })
        }
    }
})