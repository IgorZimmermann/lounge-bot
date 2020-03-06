module.exports.run = async (bot,message,args) =>{
    let author = message.author 
    message.channel.send(`Hello, ${author}!`)
}



module.exports.help = {
    name: "hello",
    aliases: ["hi"]
}