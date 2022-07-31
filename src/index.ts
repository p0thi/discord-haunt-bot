import { SapphireClient } from "@sapphire/framework";

const client = new SapphireClient({intents: ['GUILDS', 'GUILD_VOICE_STATES']});

client.login(process.env.TOKEN);