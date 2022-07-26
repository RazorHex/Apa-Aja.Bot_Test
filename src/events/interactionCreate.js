const client = require('../../index')
const { Interaction } = require('discord.js')
require('dotenv').config()


module.exports = {
    name: 'interactionCreate',
    once: false,

    /**
     * @param {Interaction} interaction
     */

    async execute (interaction) {
        //command respond
        if(interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if(!command) return;

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({ 
                    content: `There was an error while executing this command!\n${error.message}`,
                    ephemeral: true 
                });
            }
        }

        //Select menu create
        if(interaction.isSelectMenu()) {
            const { customId, member, values } = interaction

            if(customId === 'panel') {
                //docs https://discord.js.org/#/docs/discord.js/main/class/SelectMenuInteraction?scrollTo=update
                //for test purpose use 'await interaction.update({})'
                let err = null
                const role = await interaction.guild.roles.cache.find(x => x.name === values[0])

                const status = await member.roles.cache.some(x => x.name === values[0])

                if(status) {
                    await interaction.update({
                        content: `Please check for bot online status`
                    })

                    member.roles.remove(role).catch(console.error)

                    await interaction.followUp({
                        content: `Good bye ${member.user.username} -${role}`,
                        ephemeral: true
                    })
                } else {
                    await interaction.update({
                        content: `Please check for bot online status`
                    })
    
                    member.roles.add(role).catch(console.error)

                    await interaction.followUp({
                        content: `Welcome to ${role} ${member.user.username}`,
                        ephemeral: true
                    })
                }
            }
        } else {
            return
        }
    }
}