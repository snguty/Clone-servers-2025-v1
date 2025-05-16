const { Client, MessageActionRow ,ButtonStyle, Modal, TextInputComponent, TextInputStyle, PermissionsBitField ,Discord ,SelectMenuBuilder, MessageEmbed, MessageSelectMenu, MessageButton, Permissions } = require('discord.js');
const { probot_ids, recipientId, price, serverid, token } = require('./config.js');
const cooldowns1 = new Map();
const cooldowns2 = new Map();
const cooldowns = new Map();
const fs = require('fs');
const { Client: Client2 } = require('discord.js-selfbot-v13');
const { JsonDatabase } = require("wio.db");
const Database = new JsonDatabase({ databasePath: "DataBase.json" });
const client = new Client({
    intents: 3276799
});

client.on('ready', () => {
    console.log(`${client.user.username} Is Online !`);
});
client.on('ready', async () => {
    const guild = await client.guilds.fetch(serverid);
    await guild.commands.set([
        {
            name: 'setup',
            description: 'تسطيب نظام تذكرة النسخ',
            options: [
                {
                    name: 'panel_channel',
                    description: 'The panel channel for the ticket system',
                    type: 'CHANNEL',
                    required: true
                },
                {
                    name: 'category',
                    description: 'The category for ticket channels',
                    type: 'CHANNEL',
                    required: true
                }
            ]
        },
        {
            name: 'send-ticket-panel',
            description: 'Send the ticket panel in the panel channel',
        }
    ]);

    console.log('Slash commands registered.');
     console.log(`Logged in as ────────────────────────────────────────────────────────────────────────────────────────────
─██████──────────██████─██████████████─████████──████████─██████████████─████████████████───
─██░░██████████████░░██─██░░░░░░░░░░██─██░░░░██──██░░░░██─██░░░░░░░░░░██─██░░░░░░░░░░░░██───
─██░░░░░░░░░░░░░░░░░░██─██░░██████░░██─████░░██──██░░████─██░░██████░░██─██░░████████░░██───
─██░░██████░░██████░░██─██░░██──██░░██───██░░░░██░░░░██───██░░██──██░░██─██░░██────██░░██───
─██░░██──██░░██──██░░██─██░░██████░░██───████░░░░░░████───██░░██──██░░██─██░░████████░░██───
─██░░██──██░░██──██░░██─██░░░░░░░░░░██─────████░░████─────██░░██──██░░██─██░░░░░░░░░░░░██───
─██░░██──██████──██░░██─██░░██████░░██───────██░░██───────██░░██──██░░██─██░░██████░░████───
─██░░██──────────██░░██─██░░██──██░░██───────██░░██───────██░░██──██░░██─██░░██──██░░██─────
─██░░██──────────██░░██─██░░██──██░░██───────██░░██───────██░░██████░░██─██░░██──██░░██████─
─██░░██──────────██░░██─██░░██──██░░██───────██░░██───────██░░░░░░░░░░██─██░░██──██░░░░░░██─
─██████──────────██████─██████──██████───────██████───────██████████████─██████──██████████─
────────────────────────────────────────────────────────────────────────────────────────────`);
   console.log(`MAYOR SERVER : https://discord.gg/yBTBrffauG 💎`);
   console.log(`MAYOR YouTube : https://youtube.com/@3mran77?  🤍`);
});
client.on('channelCreate', async (channel) => {
    try {
        const rawData = fs.readFileSync('settings.json');
        const settings = JSON.parse(rawData);

        const categoryId = settings.categoryId;

        if (!categoryId) {
            return channel.send({ content: 'Category is not set. Please use /setup command to set it.', ephemeral: true });
        }

        if (channel.parentId === categoryId) {
            setTimeout(async () => {
                const embed = new MessageEmbed()
.setImage('https://i.postimg.cc/C54WnHQD/Video-To-Gif-GIF.gif')
.setTitle('MAYOR SERVICES <:mayor:1324396250912784416>')
.setDescription(`

### شكرًا لاستخدامك لخدماتنا 
- نحن لا نحتفظ بأي معلومة خاصة بك
- النسخ يشمل السيرفر بالكامل وحسب اختيارك
- لا يتم نسخ الرسائل
`)
      .setColor('#78B8E7');
                const row = new MessageActionRow().addComponents(
                    new MessageButton()
                        .setCustomId('copy_in_server')
                        .setStyle('PRIMARY')
                        .setEmoji('<a:emoji_1738650686926:1336222572550946828>'),
                    new MessageButton()
                        .setCustomId('cancel_ticket')
                        .setStyle('DANGER')
                        .setEmoji('<:emoji_73:1326144870040993864>'),
                );

                await channel.send({
                    embeds: [embed],
                    components: [row],
                });

            }, 100);
        }
    } catch (error) {
        console.error(error);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    const { customId, channel } = interaction;

  if (customId === 'cancel_ticket') {
        await interaction.reply({ content: 'سيتم حذف التذكرة بعد 5 ثواني.', ephemeral: true });
        setTimeout(() => {
            channel.delete().catch(console.error);
        }, 5000);
    }
});
let ticketCounter = { count: 0 };

function initializeTicketCounter() {
    try {
        const rawData = fs.readFileSync('tickets.json');
        const savedData = JSON.parse(rawData);
        ticketCounter = savedData.ticketCounter || { count: 0 };
    } catch (error) {
        console.error('Error reading tickets.json:', error);
        ticketCounter = { count: 0 }; 
    }
}

function saveTicketCounter() {
    fs.writeFile('tickets.json', JSON.stringify({ ticketCounter }, null, 2), (err) => {
        if (err) console.error('Error saving ticket counter:', err);
    });
}

initializeTicketCounter();

function incrementTicketCounter() {
    ticketCounter.count++;
    saveTicketCounter();
}

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand() && !interaction.isSelectMenu()) return;

    if (interaction.isCommand()) {
        const { commandName, options, guild } = interaction;

        if (commandName === 'setup') {
            if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
                return interaction.reply({ content: 'You are not authorized to use this command.', ephemeral: true });
            }

            const panelChannel = options.getChannel('panel_channel');
            const categoryChannel = options.getChannel('category');

            if (!panelChannel || !categoryChannel || categoryChannel.type !== 'GUILD_CATEGORY') {
                return interaction.reply({ content: 'Please provide both a panel channel and a valid category.', ephemeral: true });
            }

            const settings = {
                panelChannelId: panelChannel.id,
                categoryId: categoryChannel.id
            };

            fs.writeFile('settings.json', JSON.stringify(settings, null, 2), (err) => {
                if (err) throw err;
                console.log('Settings saved in settings.json');
                interaction.reply({ content: 'Settings saved successfully.', ephemeral: true });
            });
        } else if (commandName === 'send-ticket-panel') {
            if (!interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
                return interaction.reply({ content: 'You are not authorized to use this command.', ephemeral: true });
            }

            try {
                const rawData = fs.readFileSync('settings.json');
                const settings = JSON.parse(rawData);

                const panelChannelId = settings.panelChannelId;

                if (!panelChannelId) {
                    return interaction.reply({ content: 'Panel channel is not set. Please use /setup command to set it.', ephemeral: true });
                }

                const row = new MessageActionRow()
                    .addComponents(
                        new MessageSelectMenu()
                            .setCustomId('ticket-menu')
                            .setPlaceholder('Select an option')
                            .addOptions([
                                {
                                    label: 'Open Ticket',
                                    value: 'open_ticket',
                                    emoji: "<:ticket:1324730933495992371>"
                                },
                                {
                                    label: 'Reset Menu',
                                    value: 'reset_menu',
                                    emoji: "<a:loading:1324747781478289450>"
                                }
                            ])
                    );

                const embed = new MessageEmbed()
                    .setImage('https://i.postimg.cc/C54WnHQD/Video-To-Gif-GIF.gif')
.setTitle('MAYOR SERVICES <:mayor:1324396250912784416>')
.setDescription(`

### شكرًا لاستخدامك لخدماتنا 
- نحن لا نحتفظ بأي معلومة خاصة بك
- النسخ يشمل السيرفر بالكامل وحسب اختيارك
- لا يتم نسخ الرسائل
`)
      .setColor('#78B8E7');


                const channel = await client.channels.fetch(panelChannelId);
                if (channel && channel.isText()) {
                    await channel.send({ embeds: [embed], components: [row] });
                    interaction.channel.reply({ content: 'Ticket panel sent successfully', ephemeral: true });
                } else {
                    interaction.reply({ content: 'Panel channel not found or not a text channel', ephemeral: true });
                }
            } catch (err) {
                console.error('Error:', err);
                interaction.reply({ content: 'An error occurred while sending the ticket panel', ephemeral: true });
            }
        }
    } else if (interaction.isSelectMenu()) {
        const { customId, values } = interaction;

        if (customId === 'ticket-menu') {
            if (values[0] === 'open_ticket') {
                try {
                    const rawData = fs.readFileSync('settings.json');
                    const settings = JSON.parse(rawData);

                    const categoryId = settings.categoryId;

                    if (!categoryId) {
                        return interaction.reply({ content: 'Category is not set. Please use /setup command to set it.', ephemeral: true });
                    }

                    const guild = interaction.guild;
                    const category = guild.channels.cache.get(categoryId);
                    if (!category || category.type !== 'GUILD_CATEGORY') {
                        return interaction.reply({ content: 'Invalid category set in the settings.', ephemeral: true });
                    }

      
                    if (ticketCounter[interaction.user.id]) {
                        return interaction.reply({ content: 'You have already created a ticket.', ephemeral: true });
                    }


                    const ticketNumber = String(ticketCounter.count).padStart(2, '0');

                    const ticketChannel = await guild.channels.create(`ticket-${ticketNumber}`, {
                        type: 'GUILD_TEXT',
                        parent: categoryId,
                        permissionOverwrites: [
                            {
                                id: interaction.user.id,
                                allow: ['VIEW_CHANNEL']
                            },
                            {
                                id: guild.roles.everyone,
                                deny: ['VIEW_CHANNEL']
                            }
                        ]
                    });
                    
                    ticketCounter[interaction.user.id] = ticketChannel.id;
                    incrementTicketCounter();
                                        
                    interaction.reply({ content: `Ticket channel <#${ticketChannel.id}> created successfully`, ephemeral: true });
                } catch (err) {
                    console.error('Error:', err);
                    interaction.reply({ content: 'An error occurred while creating the ticket channel.', ephemeral: true });
                }
            } else if (values[0] === 'reset_menu') {
                try {
           
                    interaction.values = ['Reset_Selected'];
                    await interaction.update().catch(async() => { return; });
                    await interaction.followUp({ content: 'Menu reset successfully.', ephemeral: true });
                } catch (error) {
                    console.error('Error while resetting selection menu:', error);
                    await interaction.followUp({ content: 'Failed to reset menu.', ephemeral: true });
                }
            }
        }
    }
});

client.on('channelDelete', async (channel) => {
    if (channel.type === 'GUILD_TEXT' && ticketCounter) {
        const userId = Object.keys(ticketCounter).find(key => ticketCounter[key] === channel.id);
        if (userId) {
            delete ticketCounter[userId];
            saveTicketCounter();
        }
    }
});
client.on('interactionCreate', async (interaction) => {
  if (interaction.isButton()) {
    
    if (interaction.customId === 'confirm1' && cooldowns.get(interaction.message.id) && !cooldowns2.has(interaction.user.id)) {
        const {
        user,
        token,
        id,
        id2
      } = cooldowns.get(interaction.message.id);

      if (user !== interaction.user.id) return;

      await interaction.deferReply({
        ephemeral: true
      });
      const client2 = new Client2({
        checkUpdate: false
      });

      try {
        await client2.login(token);

      } catch {
        return interaction.editReply('هذا التوكن غير صحيح');
      }

      const guild = client2.guilds.cache.get(id);
      const guild2 = client2.guilds.cache.get(id2);

      if (!guild) return interaction.editReply('انت لست موجود في الخادم الأول');
      if (!guild2) return interaction.editReply('انت لست موجود في الخادم التاني');
     

      await cooldowns2.set(interaction.user.id);
      await interaction.editReply(`\`\`\`#credit ${recipientId} ${price}\`\`\``);

      let done = false;
      const price1 = price === 1 ? 1 : Math.floor(price * 0.95);
      const filter = message => probot_ids.includes(message.author.id) && message.content.includes(`${price1}`) & message.content.includes(`${recipientId}`) && message.content.includes(`${interaction.user.username}`);
      const pay = await interaction.channel.createMessageCollector({
        filter,
        max: 1,
        time: 3e5
      });

      pay.once('collect', async () => {
        done = true;
        interaction.editReply('**جاري النسخ ..**');

        for (const [, channel] of guild2.channels.cache) {
          await channel.delete().catch(() => {});
        }

        for (const [, role] of guild2.roles.cache) {
          await role.delete().catch(() => {});
        }

        for (const [, emoji] of guild2.emojis.cache) {
          await emoji.delete().catch(() => {});
        }

        const roles = new Map();
        const categories = new Map();

        const guildRoles = [...guild.roles.cache.values()].sort((a, b) => a.rawPosition - b.rawPosition);

        const guildCategories = [...guild.channels.cache.filter((channel) => channel.type === 'GUILD_CATEGORY').values()].sort((a, b) => a.rawPosition - b.rawPosition);
        const guildChannels = [...guild.channels.cache.filter((channel) => channel.type !== 'GUILD_CATEGORY').values()].sort((a, b) => a.rawPosition - b.rawPosition);

        for (const role of guildRoles) {
          try {
            if (role.id === guild.roles.everyone.id) {
              await guild2.roles.everyone.setPermissions(role.permissions.toArray());

              interaction.channel.send(`1 - تم تحديث رتبة Everyone`);
              roles.set(role.id, guild2.roles.everyone);
              continue;
            }

            const createdRole = await guild2.roles.create({
              name: role.name,
              position: role.rawPosition,
              color: role.color,
              hoist: role.hoist,
              mentionable: role.mentionable,
              permissions: role.permissions.toArray(),
            });

            console.log(`Created Role: ${createdRole.name}`);
            roles.set(role.id, createdRole);

          } catch {
            console.error(`Failed to create role: ${role.name}`);
          }
        }

        interaction.channel.send(`2 - تم الإنتهاء من الرولات`);

        for (const category of guildCategories) {
          try {
            const permissionOverwrites = [];

            for (const [, overwrite] of category.permissionOverwrites.cache) {
              const role = roles.get(overwrite.id);

              if (role) {
                permissionOverwrites.push({
                  id: role.id,
                  allow: overwrite.allow.toArray(),
                  deny: overwrite.deny.toArray()
                });
              }
            }

            const createdCategory = await guild2.channels.create(category.name, {
              type: 'GUILD_CATEGORY',
              permissionOverwrites
            });

            console.log(`Created Category: ${createdCategory.name}`);
            categories.set(category.id, createdCategory);

          } catch {
            console.error(`Failed to create category: ${category.name}`);
          }
        }

        interaction.channel.send(`3 - تم الإنتهاء من الكاتجوري`);

        for (const channel of guildChannels) {
          try {
            const permissionOverwrites = [];
            const type = channel.type === 'GUILD_TEXT' ? 'GUILD_TEXT' : channel.type === 'GUILD_VOICE' ? 'GUILD_VOICE' : 'GUILD_TEXT';
            const parent = channel.parentId ? categories.get(channel.parentId) : null;

            for (const [, overwrite] of channel.permissionOverwrites.cache) {
              const role = roles.get(overwrite.id);

              if (role) {
                permissionOverwrites.push({
                  id: role.id,
                  allow: overwrite.allow.toArray(),
                  deny: overwrite.deny.toArray()
                });
              }
            }

            const createdChannel = await guild2.channels.create(channel.name, {
              type,
              permissionOverwrites,
              parent
            });

            console.log(`Created Channel: ${createdChannel.name}`);

          } catch {
            console.error(`Failed to create channel: ${channel.name}`);
          }
        }

        interaction.channel.send(`4 - تم الإنتهاء من القنوات`);

        for (const [, emoji] of guild.emojis.cache) {
          const createdEmoji = await guild2.emojis.create(emoji.url, emoji.name);

          console.log(`Created emoji: ${createdEmoji.name}`);
        }

        interaction.deleteReply();

        cooldowns1.delete(interaction.user.id);
        cooldowns2.delete(interaction.user.id);

        interaction.channel.send(`5 - تم الإنتهاء من الايموجي`);
        interaction.channel.send(`تم تم الإنتهاء من الجميع !
<@!${interaction.user.id}>`);
      });

      pay.once('end', () => {
        if (done) return;

        cooldowns1.delete(interaction.user.id);
        cooldowns2.delete(interaction.user.id);
        interaction.editReply('**انتهى وقت التحويل**');
      });
    }

    if (interaction.customId === 'copy_in_server' && !cooldowns1.has(interaction.user.id)) {
     const modal = new Modal()
          .setCustomId('server-modalx')
          .setTitle('Copy Server');
  
        const token = new TextInputComponent()
          .setCustomId('token')
          .setMinLength(1)
          .setPlaceholder('Ex: MTAwMTYxMTQ1MTIwMDQ0NjUyNQ.GBQUgg.Js0Dpx89iHG3TqrZV2Opg73vPtU9jnDd-jtEYY')
          .setStyle("SHORT")
          .setLabel('توكن الحساب');
  
        const id = new TextInputComponent()
          .setCustomId('id')
          .setMinLength(1)
          .setPlaceholder('Ex: 936974185421475864')
          .setStyle('SHORT')
          .setLabel('معرف الخادم (Server ID To Copy)');
  
        const id2 = new TextInputComponent()
          .setCustomId('id2')
          .setMinLength(1)
          .setPlaceholder('Ex: 1115277371193438362')
          .setStyle("SHORT")
          .setLabel('معرف الخادم (Server ID To Paste)');
  
        const row = new MessageActionRow().addComponents(token);
        const row1 = new MessageActionRow().addComponents(id);
        const row2 = new MessageActionRow().addComponents(id2);
  
        modal.addComponents(row, row1, row2);
        interaction.showModal(modal);
      }
  
      if (interaction.customId === 'cancel') {
        cooldowns1.delete(interaction.user.id);
        cooldowns2.delete(interaction.user.id);
        interaction.channel.delete();
      }
    }
  
    if (interaction.isModalSubmit()) {
      if (interaction.customId === 'server-modalx' && !cooldowns1.has(interaction.user.id)) {
        const token = interaction.fields.getTextInputValue('token');
        const id = interaction.fields.getTextInputValue('id');
        const id2 = interaction.fields.getTextInputValue('id2');

      await interaction.deferReply({
        ephemeral: true
      });
      const client2 = new Client2({
        checkUpdate: false
      });

      try {
        await client2.login(token);

      } catch {
        return interaction.editReply('هذا التوكن غير صحيح');
      }

      const guild = client2.guilds.cache.get(id);
      const guild2 = client2.guilds.cache.get(id2);

      if (!guild) return interaction.editReply('انت لست موجود في الخادم الأول');
      if (!guild2) return interaction.editReply('انت لست موجود في الخادم التاني');
      

      await cooldowns1.set(interaction.user.id);
      const row = new MessageActionRow().addComponents(
          new MessageButton()
          .setCustomId('confirm1')
          .setStyle("SUCCESS")
          .setLabel('Confirm'),
          new MessageButton()
          .setCustomId('cancel')
          .setStyle("SECONDARY")
          .setLabel('Cancel'));
  
        const msg = await interaction.editReply({
          content: `هل أنت متأكد ان تريد نسخ ${guild.name}؟`,
          components: [row]
        });

      cooldowns.set(msg.id, {
        user: interaction.user.id,
        token,
        id,
        id2
      });
    }
  }
});

//login bot
client.login(token)
