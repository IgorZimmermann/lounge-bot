module.exports.run = async (bot, message, args) => {
    let author = message.author
    let content = message.content.replace(".repeat", " ")
    message.channel.send(`${author}:${content}`)
    message.delete()



}

module.exports.help = {"name":"repeat","aliases":[""],"description":"Reapeats what the author said","hasAccess":"Everyone","usage":".repeat"}