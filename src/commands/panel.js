const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageSelectMenu, MessageActionRow, MessageEmbed, Interaction } = require('discord.js')
const model = require('../../db')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('panel')
        .setDescription('[Admin] Spawn role dropdown menu'),

    /**
     * 
     * @param {Interaction} interaction 
     * @returns 
     */
    async execute(interaction) {
        if(!await interaction.member.permissions.has('ADMINISTRATOR')) {
            await interaction.reply({
                content: `${interaction.user.username} did not has access to this command`,
                ephemeral: true
            })
            return
        }

        const serverId = interaction.guild.id
        let options = []

        const server = await model.findOne({server: serverId}).exec()
        if(!server) {
            interaction.reply({
                content: 'Please add a role to server',
                ephemeral: true
            })
            return
        } else {
            server.roles.forEach(role => options.push({label:role.name, description:role.description, value: role.name}))
        }

        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('panel')
                    .setPlaceholder('Select Role')
                    .addOptions(options)
            )
        
        const fancy = new MessageEmbed()
                .setTitle(interaction.guild.name)
                .setDescription('Test only')
                .setThumbnail(interaction.guild.iconURL())

        await interaction.reply({
            embeds: [fancy],
            components: [row]
        })
    }
}