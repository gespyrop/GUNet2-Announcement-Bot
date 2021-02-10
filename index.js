const Discord = require('discord.js')
const CronJob = require('cron').CronJob

const config = require('./config.json')
const courses = require('./courses.json')

const { getAnnouncements, announcementEmbed, AnnouncementRepository } = require('./announcements')

const bot = new Discord.Client()
const announcementRepository = new AnnouncementRepository()

bot.login(config.token)

// CRON

// Checks for new announcements every hour
const checkNewAnnouncements = new CronJob('00 00 * * * *', () => {
    notifyNewAnnouncements()
})

// Clears the notified array at midnight
const clearNotifiedAtMidnight = new CronJob('00 00 00 * * *', () => {
    announcementRepository.clearNotified()
})

bot.on('ready', () =>{
    console.log(`\n${bot.user.username} is online!\n`)
    
    checkNewAnnouncements.start()
    clearNotifiedAtMidnight.start()    
})

function notifyNewAnnouncements() {
    const guild = bot.guilds.cache.get(config.serverID)

    for (let course in courses) {
        let channel_name = courses[course]
        let channel = guild.channels.cache.find(ch => ch.name === channel_name)

        getAnnouncements(course, 5).then(
            announcements => {
                try {
                    announcementRepository
                        .filterNewAnnouncements(announcements)
                        .reverse()
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
        ).catch(error => console.log(`Error: Failed to fetch announcements!\n${error}`))
    }
}