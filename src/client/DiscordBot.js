const { Client, Collection, Partials } = require("discord.js");
const CommandsHandler = require("./handler/CommandsHandler");
const { warn, error, info, success } = require("../utils/Console");
const config = require("../config");
const CommandsListener = require("./handler/CommandsListener");
const ComponentsHandler = require("./handler/ComponentsHandler");
const ComponentsListener = require("./handler/ComponentsListener");
const EventsHandler = require("./handler/EventsHandler");
const { QuickYAML } = require('quick-yaml.db');

class DiscordBot extends Client {
    collection = {
        application_commands: new Collection(),
        message_commands: new Collection(),
        message_commands_aliases: new Collection(),
        components: {
            buttons: new Collection(),
            selects: new Collection(),
            modals: new Collection(),
            autocomplete: new Collection()
        }
    }
    rest_application_commands_array = [];
    login_attempts = 0;
    login_timestamp = 0;
    statusMessages = [
        { name: 'Status 1', type: 4 },
        { name: 'Status 2', type: 4 },
        { name: 'Status 3', type: 4 }
    ];

    commands_handler = new CommandsHandler(this);
    components_handler = new ComponentsHandler(this);
    events_handler = new EventsHandler(this);
    database = new QuickYAML(config.database.path);

    constructor() {
        super({
            intents: 3276799,
            partials: [
                Partials.Channel,
                Partials.GuildMember,
                Partials.Message,
                Partials.Reaction,
                Partials.User
            ],
            presence: {
                activities: [{
                    name: 'keep this empty',
                    type: 4,
                    state: 'DiscordJS-V14-Bot-Template v3'
                }]
            }
        });
        
        new CommandsListener(this);
        new ComponentsListener(this);
    }

    startStatusRotation = () => {
        let index = 0;
        setInterval(() => {
            this.user.setPresence({ activities: [this.statusMessages[index]] });
            index = (index + 1) % this.statusMessages.length;
        }, 4000);
    }

    connect = async () => {
        warn(`Attempting to connect to the Discord bot... (${this.login_attempts + 1})`);

        this.login_timestamp = Date.now();

        try {
            await this.login(process.env.CLIENT_TOKEN);
            this.commands_handler.load();
            this.components_handler.load();
            this.events_handler.load();
            this.startStatusRotation();

            warn('Attempting to register application commands... (this might take a while!)');
            await this.commands_handler.registerApplicationCommands(config.development);
            success('Successfully registered application commands. For specific guild? ' + (config.development.enabled ? 'Yes' : 'No'));// Embedを送信するテスト（ログイン完了後）
const { EmbedBuilder } = require('discord.js');

const guild = this.guilds.cache.get('1387797373559771207'); // 
const channel = guild?.channels?.cache?.get('1387797373559771211'); // 

if (channel) {
  const embed = new EmbedBuilder()
    .setTitle('📜《 契 約 書 》')
    .setDescription(
      '──ここは、夢より醒めぬ世界。\n' +
      '汝がこの地に踏み入れし時、契約は始まる。\n\n' +
      '**本契約は、以下の誓約によって成立する。**\n' +
      'いずれかの言葉を口にすることで、君は眷属となるだろう：\n\n' +
      '> 「我が魂を供物とし、汝に仕えん」\n' +
      '> 「幻想の名を刻みし者よ、我が名に眷属の刻印を」\n' +
      '> 「夢より醒めぬ者となり、今ここに契約を果たす」\n\n' +
      '──契約を交わした者には、眷属の名が授けられる。'
    )
    .setColor(0x5e4b8b)
    .setFooter({
      text: '契約は一度のみ──言葉を選ぶのは、君自身だ。',
    });

  try {
    await channel.send({ embeds: [embed] });
    success('契約書を送信しました。');
  } catch (e) {
    error('契約書送信に失敗しました');
    error(e);
  }
} else {
  error('チャンネルが見つかりませんでした。IDが正しいか確認してください。');
}
        } catch (err) {
            error('Failed to connect to the Discord bot, retrying...');
            error(err);
            this.login_attempts++;
            setTimeout(this.connect, 5000);
        }
    }
}

module.exports = DiscordBot;
