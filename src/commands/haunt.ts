import { BucketScope, Command } from '@sapphire/framework';
import { isMessageInstance } from '@sapphire/discord.js-utilities';
import { PermissionFlagsBits } from 'discord-api-types/v10'
import { Haunter } from '../Haunter';

export class HauntCommand extends Command {
  public constructor(context: Command.Context, options: Command.Options) {
    super(context, { ...options ,
      name: "haunt",
      description: "Haunt a player",
      cooldownScope: BucketScope.User,
      cooldownDelay: 120000,
      cooldownFilteredUsers: [process.env.OWNER ?? ""]
    });
  }

  public async chatInputRun(interaction: Command.ChatInputInteraction) {
    const user = interaction.options.getUser("user");
    if (!interaction.guild) {
      return
    }
    if(!user) {
      return interaction.reply({content: "You must specify a user to haunt", ephemeral: true});
    }
    const member = await interaction.guild.members.fetch(user);

    if (!member) {
      return interaction.reply({content: "That user is not in this server", ephemeral: true});
    }
    const voiceChannel = member.voice.channel;

    if (!voiceChannel) {
      return interaction.reply({content: "That user is not in a voice channel", ephemeral: true});
    }

    try {
      const haunter = new Haunter(voiceChannel, member);
      haunter.haunt();
    } catch (e) {}
    
    interaction.reply({ content: `Haunting :ghost: :ghost: :ghost: `, ephemeral: true });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand((builder) => 
      builder.setName(this.name)
        .setDescription(this.description)
        .addUserOption(userBuilder => userBuilder.setName('user').setDescription('The user to haunt').setRequired(true)
      )
      .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers), {
        idHints: [process.env.HAUNT_COMMAND_ID ?? ""]
      }
    );
  }
}