const Discord = require('discord.js')
const Parser = require('rss-parser')
const fs = require('fs')

const RSS_URL = 'https://gunet2.cs.unipi.gr/modules/announcements/rss.php?c='
const parser = new Parser()

async function getAnnouncements(course_code, limit=Infinity) {
    const feed = await parser.parseURL(`${RSS_URL}${course_code}`)

    // TODO Abstract parsing logic in a Parser class 
    // and use dependency injection to support various feeds
    let course_title = feed.title.replaceAll('Ανακοινώσεις μαθήματος ', '')

    let announcements = feed.items.slice(0, limit).map(item => ({ 
        id: new URLSearchParams(item.link).get('http://gunet2.cs.unipi.gr/modules/announcements/announcements.php?an_id'),
        course: course_title,
        title: item.title,
        content: item.contentSnippet,
        link: item.link,
        date: new Date(new Date(item.pubDate).getTime() + (60*60*1000))
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
            !this.notified.includes(announcement.id) && this.#isToday(announcement.date)
        )

        new_announcements.forEach(
            announcement => this.notified.push(announcement.id)
        )

        return new_announcements
    }

    clearNotified() {
        this.notified.length = 0
    }

    #isToday(date) {
        date = new Date (date.getTime() + (2*60*60*1000))
        let today = new Date()
        
        return date.getDate() == today.getDate() 
        && date.getMonth() == today.getMonth() 
        && date.getFullYear() == today.getFullYear()
    }
    
}

module.exports = {
    getAnnouncements: getAnnouncements,
    announcementEmbed: announcementEmbed,
    AnnouncementRepository: AnnouncementRepository
}