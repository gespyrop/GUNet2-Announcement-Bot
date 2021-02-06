const Discord = require('discord.js')
const Parser = require('rss-parser')
const fs = require('fs')

const RSS_URL = 'https://gunet2.cs.unipi.gr/modules/announcements/rss.php?c='
const parser = new Parser()

async function getAnnouncements(course_code, limit=Infinity) {
    const feed = await parser.parseURL(`${RSS_URL}${course_code}`)

    let announcements = feed.items.slice(0, limit).map(item => ({ 
        id: new URLSearchParams(item.link).get('http://gunet2.cs.unipi.gr/modules/announcements/announcements.php?an_id'),
        title: item.title,
        content: item.contentSnippet,
        date: item.pubDate
    }))

    return announcements;
}

function announcementEmbed(announcement) {
    return new Discord.MessageEmbed()
		.setColor('#00ff55')
		.setTitle(announcement.title)
        .setDescription(announcement.content)
        .setTimestamp(announcement.date)
}

class AnnouncementRepository {
    notified = [];

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
}

module.exports = {
    getAnnouncements: getAnnouncements,
    announcementEmbed: announcementEmbed,
    AnnouncementRepository: AnnouncementRepository
}