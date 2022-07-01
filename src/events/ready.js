const client = require('../../index')
const mongoose = require('mongoose')
require('dotenv').config()

module.exports = {
    name: 'ready',
    once: true,
    execute: async function() {
        console.log('\nConnecting to mongodb...')
        mongoose.connect(process.env.LOGIN, {
            keepAlive: true
        })
            .then(() => {
                console.log('Connection established...')
            })
            .catch(err => {
                console.error(err)
            })
        console.log(`\nBot Started =============================================================================================\n`)
    }
}