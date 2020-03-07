const discord = require("discord.js")

module.exports.run = async (bot, message, args) => {
    let infoEmbed = new discord.MessageEmbed()  
    infoEmbed.setTitle("Server Info")
    infoEmbed.setDescription("Info about the server")
    infoEmbed.setColor("GREEN")
    infoEmbed.setImage("https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftheultralinx.com%2F.image%2Ft_share%2FMTI5ODI1NzA5NDc1NTA2ODE5%2Fvintage-3d-gif-2gif.gif&f=1&nofb=1")
    infoEmbed.addField("Server Name", `${message.guild.name}`)
    infoEmbed.addField("Server Created At", `${message.guild.createdAt}`) 
    infoEmbed.addField("Server Owner", `${message.guild.owner}`) 
    infoEmbed.addField("Members", `${message.guild.memberCount}`)
    infoEmbed.addField("Region", `${message.guild.region}`)
    message.channel.send(infoEmbed)


}

module.exports.help = {"name":"info","aliases":[""],"description":"Info about the server","hasAccess":"Everyone","usage":".info"}