const { Client, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const Discord = require("discord.js")
module.exports = {
  name: "yardım",
  description: "Botun yardım menüsüne bakarsın!",
  type: 1,
  options: [],

  run: async(client, interaction) => {

    const embed = new EmbedBuilder()
    .setTitle("Airfax - Yardım Menüsü!")
    .setDescription("**・Moderasyon Sistemi ↷**\n > Moderasyon Sistemi hakkında bilgi alabilirsiniz.⠀⠀⠀⠀⠀\n\n**・Kayıt Sistemi ↷**\n> Kayıt Sistemi hakkında bilgi alabilirsiniz.\n\n**・Kullanıcı Sistemi ↷**\n> Kullanıcı Sistemi hakkında bilgi alabilirsiniz.")
    .setColor("Random")
    const row = new ActionRowBuilder()
    .addComponents(
new ButtonBuilder()
.setLabel("Moderasyon")
.setStyle(ButtonStyle.Secondary)
.setCustomId("moderasyon"),
new ButtonBuilder()
.setLabel("Kayıt")
.setStyle(ButtonStyle.Success)
.setCustomId("kayıt"),
new ButtonBuilder()
.setLabel("Kullanıcı")
.setStyle(ButtonStyle.Primary)
.setCustomId("kullanıcı"),
new ButtonBuilder()
.setLabel("Çekiliş")
.setStyle(ButtonStyle.Primary)
.setCustomId("çekiliş"))

interaction.reply({embeds: [embed], components: [row], ephemeral: true})
  }

};