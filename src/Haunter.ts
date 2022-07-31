import { Client, Guild, VoiceChannel, GuildMember, VoiceBasedChannel } from "discord.js";
import {
    AudioPlayer,
    joinVoiceChannel,
    getVoiceConnection,
    createAudioResource,
    createAudioPlayer,
    VoiceReceiver,
    VoiceConnection,
    AudioPlayerStatus,
  } from "@discordjs/voice";
import { createReadStream, } from "fs";
import { join } from "path";

export class Haunter {
    private static _haunters: Map<string, Haunter> = new Map();

    channel: VoiceBasedChannel;
    player: AudioPlayer;
    member: GuildMember;
    voiceReceiver?: VoiceReceiver;
    voiceConnection?: VoiceConnection;
    timer: NodeJS.Timeout;

    constructor(channel: VoiceBasedChannel, member: GuildMember) {
        const oldInstance = Haunter._haunters.get(channel.guild.id);
        Haunter._haunters.set(channel.guild.id, this);

        oldInstance?.player.stop();
        clearTimeout(oldInstance?.timer);

        this.channel = channel;
        this.member = member;
        this.player = createAudioPlayer({});
        this.timer = setTimeout(() => {this.destroy()}, 10000);
    }

    haunt(): void {
        const connection = this.joinChannel();
        connection.subscribe(this.player);

        connection.receiver.speaking.on('start', userID => {
            if (userID === this.member.user.id) {
                this.playHaunt();
            }
        });
        connection.receiver.speaking.on('end', userID => {
            if (userID === this.member.user.id) {
                this.player.stop();
            }
        });
    }

    private playHaunt(): void {
        this.player.play(createAudioResource(createReadStream(join(__dirname, '../assets/scream.mp3'))));
    }

    onStartSpeaking(user: string): void {
        console.log("speaker "+user);
    }

    joinChannel(): VoiceConnection {
        const voiceConncetion = joinVoiceChannel({
            channelId: this.channel.id,
            guildId: this.channel.guild.id,
            // @ts-ignore
            adapterCreator: this.channel.guild.voiceAdapterCreator,
            selfDeaf: false,
        })
        this.voiceConnection = voiceConncetion;
        this.voiceReceiver = new VoiceReceiver(voiceConncetion);
        return this.voiceConnection;
    }

    destroy(): void {
        this.voiceConnection?.receiver.speaking.removeAllListeners();
        this.player.removeAllListeners();
        this.voiceConnection?.destroy();
        this.player.stop();
    }
}