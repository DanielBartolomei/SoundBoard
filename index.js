// importing modules
const { Client, Intents } = require('discord.js');
const path = require('path');
require('dotenv').config();

// youtube and ytdl modules
const fs = require('fs');
const ytdl = require('ytdl-core');
const axios = require('axios').default;
const instance = axios.create({
    baseURL: "https://www.googleapis.com/youtube/v3/search"
});

// path to save the tts message requested through gtts
const filepath = path.join(__dirname, './sounds/tts_message.m4a');


// get config values from the dotenv
const prefix = process.env.PREFIX;
const bot_ch1_Id = process.env.BOT_CH1;
const bot_ch2_Id = process.env.BOT_CH2;
const token = process.env.TOKEN;

// instantiate client with the intents
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES
    ]
})



// check if client is ready
client.on('ready', () => {
    console.log("The bot is ready!");
    client.user.setActivity(`*help for help | Lesson's SoundBoard`);
    client.user.setStatus("online")
})

// import functions from discordjs/voice
const { createAudioPlayer, joinVoiceChannel, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');

// check for messageCreate event
client.on('messageCreate', async message => {

    // doesn't respond if message has been writte in the wrong channel
    if(message.channelId !== bot_ch1_Id && message.channelId !== bot_ch2_Id)
        return;

    // split the message to separate the command from its arguments
    const args = message.content.trim().split(' ');

    // check if the command is *play
    if(args[0] === `${prefix}play`){

        const connection = joinVoiceChannel({
            channelId: message.member.voice.channel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator
        })
        
        // check if there are any arguments
        if(args.length > 1){
            const player = createAudioPlayer();

            // checks that create the AudioResource if the argument is correct
            resource = createAudioResource(`./sounds/${args[1]}.m4a`);

            // if the resource has been created it plays the sound
            if(resource){
                player.play(resource);
                const subscription = connection.subscribe(player);
            }

            player.on(AudioPlayerStatus.Idle, () => {
                player.stop();
                console.log("AudioPlayer has been stopped!");
            });
        }
        
    }

    

    // command that shows the sounds available
    if(args[0] === `${prefix}sounds`){
        message.channel.send('earrape | the_scream | pallet | porcuh | prestige | bacio \n'+
                             'blbl | health_down | la_torre | posso_scegliere | oh_cristo\n'+
                             'queste_mosse | mi_uccide | motolilliu | subscribe | certo\n '+
                             'revenge | san_francisco | rispondi | jumpscare | verso_1 | pop \n '+
                             'peccue | stiam_parlando | attacc | se_funziona | monster | morto \n'+
                             'burp | basta | A | quest_mille | racist | another_scream | acuto \n' +
                             'hitler | theworld | theworld_original | yo | el_coco | male \n' +
                             'deemon | monitor | pizzica | fiora | spooky');
    }

    // command that plays text
    if(args[0] === `${prefix}tts`){

        if(args.length>1){
            lang = args[1];
            gtts = null;
            try{gtts = require('node-gtts')(lang);}
            catch(e){
                message.reply(`Sei un gaccio di troll ${message.author}, →[${lang}] non è un lingua disponibile.\n Fai *languages per vedere le lingue disponibili. `);
                return;
            }
            var msg = '';
            args.slice(2,args.length).forEach(word => msg = msg + " " + word);
            gtts.save(filepath, msg, function() {
                console.log("save done.");
            })

            const connection = joinVoiceChannel({
                channelId: message.member.voice.channel.id,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator
            })
            const player = createAudioPlayer();
            await new Promise(resolve => setTimeout(resolve, 1000));
            const resource = createAudioResource('./sounds/tts_message.m4a');

            player.play(resource);
            const subscription = connection.subscribe(player);
            await player.on(AudioPlayerStatus.Idle, () => {
                player.stop();
                console.log("AudioPlayer has been stopped!");
            });

        }
    }

    if(args[0] === `${prefix}languages`){
        message.channel.send("'__af__' : 'Afrikaans' | '__zh__' : 'Chinese' | '__en__' : 'English' | '__en-au__' : 'English (Australia)' | '__en-uk__' : 'English (United Kingdom)' | '__en-us__' : 'English (United States)'\n"+
                            "'__fr__' : 'French' | '__de__' : 'German' | '__el__' : 'Greek' | '__hi__' : 'Hindi' |  '__it__' : 'Italian' | '__ja__' : 'Japanese' | '__ko__' : 'Korean' | '__la__' : 'Latin' | '__pt__' : 'Portuguese' \n"+
                            "'__ru__' : 'Russian' | '__sr__' : 'Serbian' | '__es__' : 'Spanish' | '__es-us__' : 'Spanish (United States)' | '__sv__' : 'Swedish' | '__ta__' : 'Tamil' | '__th__' : 'Thai' | '__tr__' : 'Turkish' | '__vi__' : 'Vietnamese' | '__cy__' : 'Welsh'");
    }

    // command that shows all the commands available
    if(args[0] === `${prefix}help`){
        message.channel.send(`**Prefix:** ${prefix} \n**Commands Available:** \t__play__ *<sound>*  |  __sounds__  | __meme__ *<meme>* | __memes__ | __tts__ *<lang> <text>*  |  __languages__  |  __help__`);
    }

    if(args[0] === prefix + "rover"){
        message.channel.send("Do un bacio");
    }

    if(args[0] === prefix + "catonce"){
	message.channel.send("Se tu non hai paura, io non ho vergogna");
    }

    if(args[0] === prefix + "memes"){
	message.channel.send("tetricos | aaugh | fountain | am_or_fm | congelamento | croissant");
    }

    if(args[0] === prefix + "meme"){
	const connection = joinVoiceChannel({
		channelId: message.member.voice.channel.id,
		guildId: message.guild.id,
		adapterCreator: message.guild.voiceAdapterCreator
	});

	if(args.length > 1){
		const player = createAudioPlayer();

		resource = createAudioResource("./memes/" + args[1] + ".m4a");

		if(resource){
			player.play(resource);
			const subscription = connection.subscribe(player);
		}

		player.on(AudioPlayerStatus.Idle, () => {
			player.stop();
			console.log("AudioPlayer has been stopped!");
		});
	}
    }

    /*if(args[0] === `${prefix}test`){
        msg = '';
        args.slice(1,args.length).forEach(word => msg = msg + " " + word);
        let id = {
            value: "",
        }
        videos_from_text(msg, id)
        await new Promise(resolve => setTimeout(resolve, 5000));
        ytdl(id.value, { filter: 'audioonly'}).pipe(fs.createWriteStream('./yt_video/video.m4a'));

        const connection = joinVoiceChannel({
            channelId: message.member.voice.channel.id,
            guildId: message.guild.id,
            adapterCreator: message.guild.voiceAdapterCreator
        })

        const player = createAudioPlayer();
        const resource = createAudioResource('./yt_video/video.m4a');

        await new Promise(resolve => setTimeout(resolve, 1000));
        player.play(resource);
        const subscription = connection.subscribe(player);

        await player.on(AudioPlayerStatus.Idle, () => {
            player.stop();
            console.log("AudioPlayer has been stopped!");
        });
    }*/

})


function videos_from_text(msg, id){
    axios.defaults.headers.common['Authorization'] = process.env.YT_APIK;
    query_msg = msg.replaceAll(' ', '+');
    query = `?q=${query_msg}&key=${process.env.YT_APIK}&maxResults=2&type=video`;
    instance.get(query)
    .then(function (response) {
        // handle success
        console.log(response);
        id.value = response.data.items[0].id.videoId; 
        return;
    })
    .catch(function (error) {
        // handle error
        console.log(error);
    })
    .then(function () {
        // always executed
    });
}



// print the dependencies report of the bot
const { generateDependencyReport } = require('@discordjs/voice');
const { format } = require('path');
console.log(generateDependencyReport());


// client's login
client.login(token);

