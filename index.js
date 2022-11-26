const { Client, EmbedBuilder, GatewayIntentBits, Partials, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, InteractionType } = require("discord.js");
const INTENTS = Object.values(GatewayIntentBits);
const PARTIALS = Object.values(Partials);
const ravendb = require("raven.database");
const db = require("croxydb")
const ms = require("ms")
const client = new Client({
    intents: INTENTS,
    allowedMentions: {
        parse: ["users"]
    },
    partials: PARTIALS,
    retryLimit: 3
});

global.client = client;
client.commands = (global.commands = []);

const { readdirSync } = require("fs")
const { TOKEN } = require("./config.json");

/* Slash Komutları Yüklüyoruz */

readdirSync('./commands').forEach(f => {
  if(!f.endsWith(".js")) return;

 const props = require(`./commands/${f}`);

 client.commands.push({
       name: props.name.toLowerCase(),
       description: props.description,
       options: props.options,
       dm_permission: props.dm_permission,
       type: 1
 });

console.log(`[COMMAND] ${props.name} komutu yüklendi.`)

});


/* Slash Komutları Yüklüyoruz */

/* Eventleri Yüklüyoruz */

readdirSync('./events').forEach(e => {

  const eve = require(`./events/${e}`);
  const name = e.split(".")[0];

  client.on(name, (...args) => {
            eve(client, ...args)
        });

console.log(`[EVENT] ${name} eventi yüklendi.`)

});


/* Eventleri Yüklüyoruz */

client.login(TOKEN).then(app => {
  console.log(`[BOT] Token girişi başarılı.`)
}).catch(app => {
  console.log(`[BOT] Token girşi başarısız.`)
})


const modal = new ModalBuilder()
.setCustomId('form')
.setTitle('Airfax - Çekiliş Kurulum!')
  const a1 = new TextInputBuilder()
  .setCustomId('prize')
  .setLabel('Ödül')
  .setStyle(TextInputStyle.Paragraph) 
  .setMinLength(2)
  .setPlaceholder('Çekiliş Ödülü Ne Olacak?')
  .setRequired(true)
	const a2 = new TextInputBuilder() 
	.setCustomId('key')
	.setLabel('Key')
  .setStyle(TextInputStyle.Paragraph)  
	.setMinLength(1)
	.setPlaceholder('Çekilişin Anahtarı Ne Olacak? (Reroll, End)')
	.setRequired(true)
	const a3 = new TextInputBuilder() 
	.setCustomId('zaman')
	.setLabel('Süre')
  .setStyle(TextInputStyle.Paragraph)  
	.setMinLength(1)
	.setPlaceholder('1s/1m/1h/1d')
	.setRequired(true)
	
    const row = new ActionRowBuilder().addComponents(a1);
    const row3 = new ActionRowBuilder().addComponents(a3);
    modal.addComponents(row, row3);
  
   
client.on('interactionCreate', async (interaction) => {

	if (interaction.commandName ==="çekiliş-başlat") {    
    await interaction.showModal(modal);
	}
})
client.on('interactionCreate', async interaction => {
  if (interaction.type !== InteractionType.ModalSubmit) return;
  if (interaction.customId === 'form') {


const prize = interaction.fields.getTextInputValue("prize")
const time = interaction.fields.getTextInputValue('zaman')
let var1 = ms(time)
  
  let zaman = Date.now();

  let sure;
  let data
  try {
 data = ms(var1)
  } catch(err){
   interaction.reply("Girdiğin süre geçerli bir süre değil!")
  }
  if(data){
  let s = data.seconds;
  let m = data.minutes;
  let h = data.hours;
  let d = data.days;
  if (s) {
    sure = `${s} Seconds`;
  }
  if (m) {
    sure = `${m} Minutes`;
  }
  if (h) {
    sure = `${h} Hours`;
  }
  if (d) {
    sure = `${d} Days`;
  }
  let vars = await db.get(`cekilis.${interaction.guild.id}_${interaction.channel.id}`);
  if (!vars) {
    const row = new ActionRowBuilder()
    .addComponents(
      new ButtonBuilder()
      .setEmoji("🎉")
      .setCustomId("giveaway")
      .setStyle(ButtonStyle.Primary)
    )
    let embed = new EmbedBuilder()
      .setColor("#5865f2")
      .setTitle(prize)
      .setTimestamp()
.setDescription(`
Süre: <t:${Math.floor(Date.now()/1000) + Math.floor(var1/1000)}:R> (<t:${Math.floor(Date.now() /1000) + Math.floor(var1/1000)}:f>)
Düzenleyen: <@${interaction.user.id}>
Kazanan: 1
Katılımcı: **0**`);
interaction.reply({content: "Çekiliş Başarıyla Oluşturuldu.", ephemeral: true})
    interaction.channel.send({embeds: [embed], components: [row]}).then(mesaj => {
      db.set(`cekilis_${mesaj.id}`, interaction.user.id)
      db.push(`user_${mesaj.id}`, interaction.user.id)
       db.set(`reroll_${interaction.guild.id}`, { channelID: interaction.channel.id, messageID: mesaj.id })
      db.set(`cekilis_${interaction.channel.id}`, {
        kanalid: interaction.channel.id,
        mesajid: mesaj.id,
        hosted: interaction.user.id,
        sure: var1,
        zaman: zaman,
        toplam: 1,
        odul: prize,
        ex: Math.floor(Date.now()/1000) + Math.floor(var1/1000)
      });
      db.set(`cekilis_${mesaj.id}`, {
        kanalid: interaction.channel.id,
        mesajid: mesaj.id,
        hosted: interaction.user.id,
        sure: var1,
        zaman: zaman,
        toplam: 1,
        odul: prize,
        ex: Math.floor(Date.now()/1000) + Math.floor(var1/1000)
      });
    
    });
   

  }

  }
}

})
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;
  let message = await interaction.channel.messages.fetch(interaction.message.id)
  if (interaction.customId === 'giveaway') {
    const varmi = db.get(`user_${interaction.message.id}`)
    let data = db.get(`cekilis_${interaction.channel.id}`)
    if(!varmi) {
      let odul = data.odul
      let sure = data.ex
      let hosted = data.hosted
 
      db.push(`user_${interaction.message.id}`, interaction.user.id)
      interaction.reply({content: "Başarıyla çekilişe katıldın!", ephemeral: true})
      let katılımcı = db.get(`user_${interaction.message.id}`).length;

      const embed = new EmbedBuilder()
      .setTitle(odul)
      .setDescription(`
      Süre: <t:${sure}:R> (<t:${sure}:f>)
      Düzenleyen: <@${hosted}>
      Kazanan: 1
      Katılımcı: **${katılımcı}**`)
      .setColor("Blurple")
      message.edit({embeds: [embed]})
    } else if(varmi.includes(interaction.user.id)) {
         
      db.unpush(`user_${interaction.message.id}`, interaction.user.id)
      interaction.reply({ content: `Başarıyla çekilişten ayrıldın!` , ephemeral: true })
      let katılımcı = db.get(`user_${interaction.message.id}`).length;
      let odul = data.odul
      let sure = data.ex
      let hosted = data.hosted
      const embed = new EmbedBuilder()
      .setTitle(odul)
      .setDescription(`
      Süre: <t:${sure}:R> (<t:${sure}:f>)
      Düzenleyen: <@${hosted}>
      Kazanan: 1
      Katılımcı: **${katılımcı}**`)
      .setColor("Blurple")
      message.edit({embeds: [embed]})
    } else {
      let odul = data.odul
      let sure = data.ex
      let hosted = data.hosted
      db.push(`user_${interaction.message.id}`, interaction.user.id)
      interaction.reply({content: "Başarıyla çekilişe katıldın!", ephemeral: true})
      let katılımcı = db.get(`user_${interaction.message.id}`).length;
      const embed = new EmbedBuilder()
      .setTitle(odul)
      .setDescription(`
      Süre: <t:${sure}:R> (<t:${sure}:f>)
      Düzenleyen: <@${hosted}>
      Kazanan: 1
      Katılımcı: **${katılımcı}**`)
      .setColor("Blurple")
      message.edit({embeds: [embed]})
    }
}
})
client.on("ready", async () => {
  const moment = require("moment") 
  require("moment-duration-format")
  moment.locale("tr")
 setInterval(async () => {
   client.guilds.cache.map(async guild => {
     guild.channels.cache.map(async channel => {
       let datax = db.fetch(`cekilis_${channel.id}`);
      if (!datax) return;
        let mesaj = datax.mesajid
      
      let data = db.get(`cekilis_${mesaj}`)
       if (data) {
         let time = Date.now() - data.zaman;
         let sure = data.sure;

let kanal = guild.channels.cache.get(data.kanalid);
kanal.messages.fetch(data.mesajid).then(async mesaj => {
           })

        if (time >= sure) {
          let winner = [];
          let kazanan = db.get(`user_${mesaj}`)[
            Math.floor(Math.random() * db.get(`user_${mesaj}`).length)];
            if (!winner.map((winir) => winir).includes(kazanan)) winner.push(kazanan);
         
             
          
           
     
           kanal.messages.fetch(data.mesajid).then(async mesaj => {   
            let katılımcı = db.get(`user_${mesaj.id}`).length;       
             const embed = new EmbedBuilder()
               .setTitle(data.odul)
              .setColor("#5865f2")
               .setTimestamp()
             .setDescription(`
Sona Erdi: <t:${Math.floor(Date.now() /1000)}:R> (<t:${Math.floor(Date.now() /1000)}:f>)
Düzenleyen: <@${data.hosted}>
Kazanan: <@${winner}> 
Katılımcı: **${katılımcı}**`)
           mesaj.edit({embeds: [embed], components: []})  
    
            if(winner){
             db.set(`cekilis_${mesaj.id}`, data.odul);  
             db.delete(`cekilis_${channel.id}`);
            
             kanal.send(`Tebrikler <@${winner}> **${data.odul}** Kazandın!`)
           db.set(`son_${mesaj.id}`, true)
       
            } else {
              db.delete(`cekilis_${mesaj.id}`);  
              db.delete(`cekilis_${channel.id}`);                
               const embed = new EmbedBuilder()
               .setTitle(data.odul)
              .setColor("#5865f2")
             .setDescription(`
Sona Erdi: <t:${Math.floor(Date.now() /1000)}:R> (<t:${Math.floor(Date.now() /1000)}:f>)
Düzenleyen: <@${data.hosted}>
Kazanan: Bilinmiyor.
Katılımcı: **0**`) 
mesaj.edit({embeds: [embed], components: []})

         
            }
                   })                                           
                  }
         }
       })
       }
     );
   });
 }, 5000);



 client.on("messageCreate", async message => {
  const db = require("croxydb");

  if (await db.get(`afk_${message.author.id}`)) {
   
    db.delete(`afk_${message.author.id}`);

    message.reply("Afk Modundan Başarıyla Çıkış Yaptın!");
  }

  var kullanıcı = message.mentions.users.first();
  if (!kullanıcı) return;
  var sebep = await db.get(`afk_${kullanıcı.id}`);

  if (sebep) {
    message.reply("Etiketlediğin Kullanıcı **"+sebep+"** Sebebiyle Afk Modunda!");
  }
});



client.on("guildMemberAdd", member => {
  const kanal = db.get(`hgbb_${member.guild.id}`)
  if(!kanal) return;
  member.guild.channels.cache.get(kanal).send({content: `:inbox_tray: | ${member} sunucuya katıldı! Sunucumuz **${member.guild.memberCount}** kişi oldu.`})
})


client.on("guildMemberRemove", member => {
  const kanal = db.get(`hgbb_${member.guild.id}`)
  if(!kanal) return;
  member.guild.channels.cache.get(kanal).send({content: `:outbox_tray: | ${member} sunucudan ayrıldı! Sunucumuz **${member.guild.memberCount}** kişi oldu.`})
})

client.on("messageCreate", (message) => {
  const db = require("croxydb")
  let kufur = db.fetch(`kufurengel_${message.guild.id}`)
  if(!kufur) return;
  
  if(kufur) {
  const kufurler = [
    
    "amk",
    "piç",
    "yarrak",
    "oç",
    "göt",
    "amq",
    "yavşak",
    "amcık",
    "amcı",
    "orospu",
    "sikim",
    "sikeyim",
    "aq",
    "mk"
       
  ]
  
if(kufurler.some(alo => message.content.toLowerCase().includes(alo))) {
message.delete()
message.channel.send(`Hey <@${message.author.id}>, Bu Sunucuda Küfür Engel Sistemi Aktif! `)
}
}
})

client.on("guildMemberAdd", member => {
  const rol = db.get(`otorol_${member.guild.id}`)
  if(!rol) return;
  member.roles.add(rol).catch(() => {})

})
client.on("guildMemberAdd", member => {
  const tag = db.get(`ototag_${member.guild.id}`)
  if(!tag) return;
  member.setNickname(`${tag} | ${member.displayName}`)
})

client.on("messageCreate", (message) => {
  const db = require("croxydb")
  let reklamlar = db.fetch(`reklamengel_${message.guild.id}`)
  if(!reklamlar) return;
  
  if(reklamlar) {

  const linkler = [
    
    ".com.tr",
    ".net",
    ".org",
    ".tk",
    ".cf",
    ".gf",
    "https://",
    ".gq",
    "http://",
    ".com",
    ".gg",
    ".porn",
    ".edu"
       
  ]
  
if(linkler.some(alo => message.content.toLowerCase().includes(alo))) {
message.delete()
message.channel.send(`Hey <@${message.author.id}>, Bu Sunucuda Reklam Engel Sistemi Aktif! `)
}
}
})

client.on("messageCreate", (message) => {
  
  let saas = db.fetch(`saas_${message.guild.id}`)
  if(!saas) return;
  
  if(saas) {
  
  let selaamlar = message.content.toLowerCase()  
if(selaamlar === 'sa' || selaamlar === 'slm' || selaamlar === 'sea' || selaamlar === ' selamünaleyküm' || selaamlar === 'Selamün Aleyküm' || selaamlar === 'selam'){

message.channel.send(`<@${message.author.id}> Aleykümselam, Hoşgeldin ☺️`)
}
}
})



client.on("interactionCreate", async interaction => {
  if (!interaction.isButton()) return;
  let message = await interaction.channel.messages.fetch(interaction.message.id)  
  if(interaction.customId == "moderasyon") {
const embed = new EmbedBuilder()
.setTitle("Airfax - Moderasyon Menüsü!")
.setDescription("/ban-list - **Banlı Kullanıcıları Gösterir!**\n/ban - **Bir Üyeyi Yasaklarsın!**\n/emojiler - **Emojileri Görürsün!**\n/forceban - **ID İle Bir Kullanıcıyı Yasaklarsın!**\n/giriş-çıkış - **Giriş çıkış kanalını ayarlarsın!**\n/kanal-açıklama - **Kanalın Açıklamasını Değiştirirsin!**\n/kick - **Bir Üyeyi Atarsın!**\n/küfür-engel - **Küfür Engel Sistemini Açıp Kapatırsın!**\n/oto-rol - **Otorolü Ayarlarsın!**\n/oto-tag - **Oto Tagı Ayarlarsın!**\n/oylama - **Oylama Açarsın!**\n/reklam-engel - **Reklam Engel Sistemini Açarsın!**\n/rol-al - **Rol Alırsın**\n/rol-oluştur - **Rol Oluşturursun!**\n/rol-ver - **Rol Verirsin!**\n/sa-as - **Selam Sistemine Bakarsın!**\n/temizle - **Mesaj Silersin!**\n/unban - **Bir üyenin yasağını kaldırırsın!**")
.setColor("Random")
interaction.reply({embeds: [embed], components: [], ephemeral: true})
  }
  if(interaction.customId == "kayıt") {
    const embed = new EmbedBuilder()
    .setTitle("Airfax - Kayıt Menüsü!")
    .setDescription("/kayıtlı-rol - **Kayıtlı Rolünü Ayarlarsın!**\n/kayıt-et - **Bir Üyeyi Kayıt Edersin!**")
    .setColor("Random")
    interaction.reply({embeds: [embed], components: [], ephemeral: true})
  }
  if(interaction.customId == "kullanıcı") {
    const embed = new EmbedBuilder()
    .setTitle("Airfax - Kullanıcı Menüsü!")
    .setDescription("/avatar - **Bir Kullanıcının Avatarına Bakarsın!**\n/afk - **Sebepli Afk Olursun!**\n/emoji-yazı - **Bota Emoji İle Yazı Yazdırırsın!**\n/istatistik - **Bot istatistiklerini gösterir!**\n/kurucu-kim - **Kurucuyu Gösterir!**\n/ping - **Botun pingini gösterir!**")
    .setColor("Random")
    interaction.reply({embeds: [embed], components: [], ephemeral: true})
  }
  if(interaction.customId == "çekiliş") {
    const embed = new EmbedBuilder()
    .setTitle("Airfax - Çekiliş Menüsü!")
    .setDescription("/çekiliş-başlat - **Bir Çekiliş Başlatır!**\n/çekiliş-bitir - **Çekilişi Bitirir!**\n/çekiliş-yenile - **Çekilişin Kazananını Tekrar Belirler!**")
    .setColor("Random")
    interaction.reply({embeds: [embed], components: [], ephemeral: true})
  }
})
