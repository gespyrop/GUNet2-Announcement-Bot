const Discord = require('discord.js')
const Parser = require('rss-parser')
const fs = require('fs')

const RSS_URL = 'https://gunet2.cs.unipi.gr/modules/announcements/rss.php?c='
const parser = new Parser()

async function getAnnouncements(course_code, limit=10) {

    const feed = await parser.parseURL(`${RSS_URL}${course_code}`)

    let announcements = feed.items.slice(0, limit).map(item => ({ 
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

module.exports = {
    getAnnouncements: getAnnouncements,
    announcementEmbed: announcementEmbed
}