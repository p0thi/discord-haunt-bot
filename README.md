
# Discord Haunting Bot

A small bot to haunt other users by always screaming when they start talking for 10 seconds.


## Deployment

Bevore the bot can work, there has to be an `bot.env` file created, that contains all required info for the bot to run. An example file can be found [here](.env.example).
The easiest way to deploy the bot is with [docker compose](https://docs.docker.com/compose/). An example `docker-compose.yml` file can be found [here](docker-compose.yml).

It is recomendet to use yarn as a packet manager. Node 16 is required to run this code.\
The following steps show how to run the code locally:

Run it:
```bash
  yarn start
```

