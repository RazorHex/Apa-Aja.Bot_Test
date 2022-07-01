const { SlashCommandBuilder } = require('@discordjs/builders');
const { Interaction } = require('discord.js')
const model = require('../../db')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add')
        .setDescription('[Admin] Adding new role to database')
        .addRoleOption(option => 
            option.setName('role')
                .setDescription('Role to add')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('description')
                .setDescription('Describe the role or benefit')
                .setRequired(true)    
        ),

    /**
     * @param {Interaction} interaction
     */

    async execute(interaction) {
        if(!await interaction.member.permissions.has('ADMINISTRATOR')) {
            await interaction.reply({
                content: `${interaction.user.username} did not has access to this command`,
                ephemeral: true
            })
            return
        }

        const serverId = await interaction.guild.id
        const role = await interaction.options.data[0].role
        const description = await interaction.options.data[1].value
        const map = {
            name: role.name,
            description
        }

        await interaction.reply({
            content: `Role found: ${role}\nPlease wait...`,
            ephemeral: true
        })

        let found = await model.findOne({server: serverId}).exec()
        if(!found) {
            const newMap = {
                server: serverId,
                roles: map
            }
            new model(newMap).save()
        } else {
            let check = found.roles.filter(item => item.name != role.name)
            check.push(map)
            await found.updateOne({roles: check}).exec()
        }

        await interaction.followUp({
            content: `Database updated!`,
            ephemeral: true
        })
    }
}