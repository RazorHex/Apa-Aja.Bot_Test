const { SlashCommandBuilder } = require('@discordjs/builders');
const model = require('../../db')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('[Admin] Remove a role from database')
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('Role to remove')
                .setRequired(true)
        ),
    async execute(interaction) {
        if(!await interaction.member.permissions.has('ADMINISTRATOR')) {
            await interaction.reply({
                content: `${interaction.user.username} did not has access to this command`,
                ephemeral: true
            })
            return
        }

        const roleId = interaction.options.data[0].role
        const serverId = interaction.guild.id

        const server = await model.findOne({server: serverId}).exec()
        if(!server) {
            interaction.reply({
                content: 'Please add role to database first',
                ephemeral: true
            })
        } else {
            let role = server.roles.filter(item => item.name != roleId.name)
            await server.updateOne({roles: role}).exec()
        }
        interaction.reply({
            content: `Removed role ${roleId.name}`,
            ephemeral: true
        })
    }
}