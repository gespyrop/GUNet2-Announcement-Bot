const Discord = require('discord.js')
const Parser = require('rss-parser')
const fs = require('fs')

const RSS_URL = 'https://gunet2.cs.unipi.gr/modules/announcements/rss.php?c='
const parser = new Parser()

async function getAnnouncements(course_code, limit=Infinity) {
    const feed = await parser.parseURL(`${RSS_URL}${course_code}`)
    let course_title = feed.title.replaceAll('Ανακοινώσεις μαθήματος ', '')

    let announcements = feed.items.slice(0, limit).map(item => ({ 
        id: new URLSearchParams(item.link).get('http://gunet2.cs.unipi.gr/modules/announcements/announcements.php?an_id'),
        course: course_title,
        title: item.title,
        content: item.contentSnippet,
        link: item.link,
        date: item.pubDate
    }))

    return announcements
}

function announcementEmbed(announcement) {
    let embed = new Discord.MessageEmbed()
    .setColor('#052647')
    .setTitle(announcement.title)
    .setTimestamp(announcement.date)
    .setAuthor(announcement.course)
    .setURL(announcement.link)
    
    if (announcement.content.length < 2048)
        embed.setDescription(announcement.content)

    return embed
}

class AnnouncementRepository {
    notified = []

    filterNewAnnouncements(announcements) {
        // Today's new announcements
        let new_announcements = announcements.filter(
            announcement => 
            !(this.notified.includes(announcement.id) || new Date(announcement.date) < new Date())
        )

        new_announcements.forEach(
            announcement => this.notified.push(announcement.id)
        )

        return new_announcements
    }

    clearNotified() {
        this.notified.length = 0
    }
}

module.exports = {
    getAnnouncements: getAnnouncements,
    announcementEmbed: announcementEmbed,
    AnnouncementRepository: AnnouncementRepository
}