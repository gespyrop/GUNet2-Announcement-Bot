const Discord = require('discord.js')

const config = require('./config.json')
const courses = require('./courses.json')

const { getAnnouncements, announcementEmbed, AnnouncementRepository } = require('./announcements')

const bot = new Discord.Client()
const announcementRepository = new AnnouncementRepository()

bot.login(config.token)

// TODO Schedule cron to check for new announcements

bot.on('ready', () =>{
    console.log(`\n${bot.user.username} is online!\n`)

    let guild = bot.guilds.cache.get(config.serverID)
    
    for (let course in courses) {
        let channel_name = courses[course]
        let channel = guild.channels.cache.find(ch => ch.name === channel_name)

        getAnnouncements(course, 5).then(
            announcements => {
                try {
                    announcementRepository
                        .filterNewAnnouncements(announcements)
                        .forEach(
                            announcement => channel.send(
                                announcementEmbed(announcement)
                            )
                        )
                } catch (error) {
                    if (error instanceof TypeError)
                        console.log(`Error: Channel "${channel_name}" for ${course} not found!`)
                }
            }
        )
    }
})
