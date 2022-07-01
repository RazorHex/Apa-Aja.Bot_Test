/*
    !!! ATTENTION !!!

    Create new .env file and insert the text below

    TOKEN=[Your bot token]
    LOGIN=[Your mongodb connection URI]

    DOCS:
        -MongoDB URI    : https://www.mongodb.com/docs/drivers/node/current/fundamentals/connection/connect/#std-label-node-connect-to-mongodb
        -Mongoose       : https://mongoosejs.com/docs/guide.html
        -DiscordJS      : https://discord.js.org/#/
        -DiscordJS Guide: https://discordjs.guide/#before-you-begin
*/

const {Client, Collection} = require('discord.js')
var ascii = require('ascii-table')
const fs = require('fs')
const path = require('path')
require('dotenv').config()
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);
const id = '852363041696907295'
const clientId = '942788321120235570'
const client = new Client({intents: 14023})
module.exports = client

//Event
var table = new ascii('Event Loader')
    .setHeading('Event', 'Status')

let num = 0

console.log('Checking for events...')
const loc = path.join(__dirname, 'src/events')
const eventFiles = fs.readdirSync(loc).filter(file => file.endsWith('.js'))
    
for (const file of eventFiles) {
    try {
        const filePath = path.join(loc, file);
        const event = require(filePath);
        if (event.once) {
            table.addRow(file.split('.')[0], `✔ Loaded`)
            client.once(event.name, async(...args) => event.execute(...args));
        } else {
            table.addRow(file.split('.')[0], `✔ Loaded`)
            client.on(event.name, async(...args) => event.execute(...args));
        }
    } catch (e) {
        table.addRow(file, `❌ Failed => ${e.message}`)
    }
}
console.log(table.toString())

//Sorting command
var com = new ascii('Commands')
    .setHeading('Name', 'Status')
client.commands = new Collection()
const commands = []
const comsPath = path.join(__dirname, 'src/commands')
const comsFiles = fs.readdirSync(comsPath).filter(file => file.endsWith('.js'))

for(const file of comsFiles) {
    num = num + 1
    const filePath = path.join(comsPath, file);
	const command = require(filePath);
    try {
        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
        com.addRow(file.split('.')[0], '✔ Command pushed')
    } catch(e) {
        com.addRow(file.split('.')[0], `❌ ${e.message}`)
    }
}
console.log(com.toString())
rest.put(Routes.applicationGuildCommands(clientId, id), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);

client.login(process.env.TOKEN)