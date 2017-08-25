const Discord = require("discord.js");

const config = require("./config.json");
const prefix = config.prefix;
const token = config.token;

function generateHex() {
	return "#" + Math.floor(Math.random()*16777215).toString(16);
};

var fortunes = [
	"yes",
	"no",
	"maybe",
	"fuck off"
];

var bot = new Discord.Client();

bot.on("ready", function() {
	console.log("Logged in as " + bot.user.tag);
});

bot.on("guildMemberAdd", function(member) {
	member.guild.channels.find("name", "general").send(member.toString() + " welcome");

	member.guild.createRole({
		name: member.user.username,
		color: generateHex(),
		permissions: []
	}).then(function(role) {
		member.addRole(role);
	});
});

bot.on("message", function(message) {
	if (message.author.equals(bot.user)) return;

	if (!message.content.startsWith(prefix)) return;

	var args = message.content.substring(prefix.length).split(" ");

	switch (args[0].toLowerCase()) {
		case "ping":
			message.channel.send("pong");
			break;
		case "info":
			message.channel.send("Hello, this is info");
			break;
		case "8ball":
			if (args[1]) message.channel.send(fortunes[Math.floor(Math.random() * fortunes.length)]);
			else message.channel.send("Can't read that");
			break;
		case "embed":
			var embed = new Discord.RichEmbed()
				.addField(Math.random() * 10, "no", true)
				.setColor(Math.floor(Math.random() * 1000000))
				.setColor(0xFFFF00)
				.setImage("https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Canis_lupus_laying.jpg/266px-Canis_lupus_laying.jpg")
				.setFooter("this is an embed")
				.setThumbnail(message.author.avatarURL)
				.addField(Math.floor(Math.random() * 1000000), "no", true);
			message.channel.sendEmbed(embed);
			break;
		case "setgame":
			var game = message.content.substring(8).split(" ");
			bot.user.setPresence({ game: { name: game.join(" "), type: 0 } });
			message.channel.send("I'm now playing: `" + game.join(" ") + "`");
			break;
		case "noticeme":
			message.channel.send(message.author.toString() + " hello");
			break;
		case "removerole":
			message.member.removeRole(message.member.guild.roles.find("name", message.member.user.username));
			break;
		case "deleterole":
			message.member.guild.roles.find("name", message.member.user.username).delete();
			break;
		case "addrole":
			message.member.guild.createRole({
				name: message.member.user.username,
				color: generateHex(),
				permissions: []
			}).then(function(role) {
				message.member.addRole(role);
			});
			break;
		case "team":
			if (args[1].toLowerCase() === "join" && typeof args[2] !== "undefined" && args[2] !== null && message.member.guild.roles.find("name", args[2].toLowerCase()) === null ) {
				message.member.guild.createRole({
					name: args[2].toLowerCase(),
					color: generateHex(),
					permissions: [],
					hoist: true,
					mentionable: true
				}).then(function(role) {
					message.member.addRole(role);
				});
				var things = message.member.guild.roles.find("name", "team");
				message.member.addRole(message.member.guild.roles.find("name", "team"));
				message.channel.send("You joined team `" + args[2].toLowerCase() + "`");
				break;
			};
			if (args[1].toLowerCase() === "join" && typeof args[2] !== "undefined" && args[2] !== null && message.member.guild.roles.find("name", args[2].toLowerCase()) !== null ) {
				message.channel.send("bestaat al");
				message.member.addRole(message.member.guild.roles.find("name", args[2].toLowerCase()));
				break;
			}
			if (args[1].toLowerCase() === "leave" && typeof args[2] !== "undefined" && args[2] !== null) {
				if (message.member.guild.roles.find("name", args[2].toLowerCase()).members.size === 1) {
					message.member.guild.roles.find("name", args[2].toLowerCase()).delete();
					message.channel.send("Role deleted");
				};
				message.channel.send("hello");
				message.member.removeRole(message.member.guild.roles.find("name", args[2].toLowerCase()));
				message.member.removeRole(message.member.guild.roles.find("name", "team"));
				break;
			};
		default:
			message.channel.send("Invalid Command");

	}
});

bot.login(token);
