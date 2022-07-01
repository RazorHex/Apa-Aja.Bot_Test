const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'guildMemberAdd',
    once: false,
    execute: async function(member) {
        let serverMember = await member.guild.members.fetch('427061541012111362')
        const icon = member.guild.iconURL()
        const ch = member.guild.channels.cache
        const text = ch.find(ch => ch.name === 'welcome' || ch.name === 'general')
        const fancy = new MessageEmbed()
            .setTitle('WELCOME RANDOM PERSON FROM EARTH')
            .setColor('GREEN')
            .setThumbnail(icon)
            .setDescription('Ini adalah server yang dipenuhi oleh orang orang dari berbagai daerah dan berbagai profesi')
            .addField('Username', member.user.username, true)
            .addField('Server Member', `${member.guild.memberCount}`, true)
            .addField('Pick a Role', `${ch.find(ch => ch.name === 'role')}`, false)
            .setFooter({text: `Bot's profile picture made by ${serverMember.user.username}`})

        text.send({
            embeds: [fancy]
        })
    }
}