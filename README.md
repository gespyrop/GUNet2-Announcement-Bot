# GUNet2 Announcement Bot

A Discord bot that checks the eClass of the Department of Informatics in University of Piraeus for new announcements and notifies students at the corresponding channel.

## Deploy your own instance

##### Start the bot with Docker

1. Clone the repository

    ```bash
    git clone git@github.com:gespyrop/GUNet2-Announcement-Bot.git
    ```

2. Add a `config.json` with the following
    ```json
    {
        "token": "YOUR_TOKEN",
        "serverID": "YOUR_SERVER_ID"
    }
    ```

3. Set the channel to send notifications for each course in `courses.json`. (You can delete the courses for which you do not wish to receive notifications or add new ones)

4. Build the docker image
    ```bash
    docker build -t gunet2 .
    ```

5. Start the bot in the background
    ```bash
    docker run --name=gunet2-bot -d gunet2
    ```

##### Stop the bot
```bash
docker stop gunet2-bot
```

##### Restart the bot
```bash
docker restart gunet2-bot
```

## License & copyright

© George Spyropoulos

Licensed under the [MIT License](LICENSE).
