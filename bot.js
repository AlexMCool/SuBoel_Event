const Discord = require("discord.js");

const config = require("./config.json");
const prefix = config.prefix;
const token = config.token;
const log_channel = config.log_channel;

const userdata = require("./userdata.json");
const fs = require("fs");

function loadUserdata() {
	var userdata = JSON.parse(fs.readFileSync("./userdata.json", "utf8", loadDone()));
	console.log("load");
};

function loadDone() {
	console.log(userdata[180975824273408000].team)
	console.log("done");
};

function generateHex() {
	return "#" + Math.floor(Math.random()*16777215).toString(16);
};

function saveJSON(filePath, fileData) {
	fs.writeFile(filePath, JSON.stringify(fileData, null, 2), (err) => {
		if (err) console.error(err);
	});
};

function log(author, title, description, channel, field1, field2, field3, field4, field5) {
	var date = new Date();
	var minutes = date.getMinutes().toString().length == 1 ? '0'+ date.getMinutes() : date.getMinutes();
	var hours = date.getHours().toString().length == 1 ? '0'+ date.getMinutes() : date.getMinutes();
	var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

	var timeString = date.toLocaleTimeString("en-GB", {hour12: false});
	var dateString = days[date.getDay()] + " " + date.getDate() + " " + months[date.getMonth()];

	var logMessage = "[" + dateString + " " + timeString + "] " + author.tag + " > " + title.toLowerCase();
	var embed = new Discord.RichEmbed()
		.setColor(0xFFFF00)
		.setFooter(author.username + " on " + dateString + " at " + timeString, author.avatarURL)
		.setTitle(title)
	if (channel) {
		embed.setFooter(author.username + " in #" + channel.name + " on " + dateString + " at " + timeString, author.avatarURL);
		logMessage += " in #" + channel.name;
	};
	if (description) {
		embed.setDescription(description);
		logMessage += " (" + description.toLowerCase() + ")";
	};
	if (field1) {
		embed.addField(field1[0], field1[1], true);
		logMessage += " (" + field1[0].toLowerCase() + ": \"" + field1[1].toLowerCase() + "\")";
	};
	if (field2) {
		embed.addField(field2[0], field2[1], true);
		logMessage += " (" + field2[0].toLowerCase() + ": \"" + field2[1].toLowerCase() + "\")";
	};
	if (field3) {
		embed.addField(field3[0], field3[1], true);
		logMessage += " (" + field3[0].toLowerCase() + ": \"" + field3[1].toLowerCase() + "\")";
	};
	if (field4) {
		embed.addField(field4[0], field4[1], true);
		logMessage += " (" + field4[0].toLowerCase() + ": \"" + field4[1].toLowerCase() + "\")";
	};
	if (field5) {
		embed.addField(field5[0], field5[1], true);
		logMessage += " (" + field5[0].toLowerCase() + ": \"" + field5[1].toLowerCase() + "\")";
	};
	bot.channels.get(log_channel).send({embed});
	console.log(logMessage);
};

var fortunes = [
	"yes",
	"no",
	"maybe",
	"fuck off"
];

var bot = new Discord.Client();

bot.on("ready", function() {
	log(bot.user, "Logged In");
});

bot.on("message", function(message) {
	// message from bot
	if (message.author.equals(bot.user)) return;

	// message without prefix
	if (!message.content.startsWith(prefix)) return;

  // set variable to all args
	var args = message.content.substring(prefix.length).split(" ");

	// get lowercase of first arg
	switch (args[0].toLowerCase()) {
		// command ping
		case "ping":
			log(message.author, "Ran Command \"ping\"", null, message.channel)
			message.channel.send("pong");
			break;

		// command delete
		case "delete":
			// only my ID
			if (message.author.id === "180975824273408000") {
				let messageCount = parseInt(args[1]);
				if (messageCount >= 2 && messageCount < 100) {
					message.channel.fetchMessages({limit: messageCount}).then(messages => message.channel.bulkDelete(messages));
					log(message.author, "Ran Command \"delete\"", null, message.channel, ["Messages Deleted", args[1]]);
					break;
				}
				else {
					message.channel.send("[2,100>");
					log(message.author, "Ran Command \"delete\"", null, message.channel, ["Error", "Not A Valid Number"])
					break;
				}
				break;
			}
			// no permissions
			else {
				message.channel.send("NO PERMISSIONS")
				log(message.author, "Ran Command \"delete\"", null, message.channel, ["Error", "No Permissions"])
			}
			break;

		// command info
		case "info":
			log(message.author, "Ran Command \"info\"", null, message.channel)
			message.channel.send("Hello, this is info");
			break;

		// command 8ball
		case "8ball":
			// get random string from list
			if (args[1]) {
				var answer = fortunes[Math.floor(Math.random()) * fortunes.length];
				message.channel.send(answer);
				log(message.author, "Ran Command \"8ball\"", null, message.channel, ["Question", message.content.substring(7)], ["Answer", answer]);
			}
			// no first word
			else {
				message.channel.send("Can't read that");
				log(message.author, "Ran Command \"8ball\"", null, message.channel, ["Error", "No Question Specified"]);
			};
			break;

		// command setgame
		case "setgame":
			// set variable to game
			var game = message.content.substring(9);
			if (game) {
				// set game
				bot.user.setPresence({
					game: {
						name: game,
						type: 0
					}
				});
				message.channel.send("I'm now playing: `" + game + "`");
				log(message.author, "Ran Command \"setgame\"", null, message.channel, ["Game", game]);
				break;
			}
			else {
				// clear game
				bot.user.setPresence({
					game: null
				});
				message.channel.send("Cleared game");
		 		log(message.author, "Ran Command \"setgame\"", "Cleared Game", message.channel);
				break;
			};
			break;

		// command test
		case "test":
			message.channel.send({embed: {
			  color: 3447003,
			  author: {
			    name: bot.user.tag,
			    icon_url: bot.user.avatarURL,
					url: bot.user.avatarURL
			  },
			  title: 'This is an embed',
			  url: 'http://google.com',
			  description: 'This is a test embed to showcase what they look like and what they can do.',
			  fields: [
			    {
			      name: 'Fields',
			      value: 'They can have different fields with small headlines.'
			    },
			    {
			      name: 'Masked links',
			      value: 'You can put [masked links](http://google.com) inside of rich embeds.'
			    },
			    {
			      name: 'Markdown',
			      value: 'You can put all the *usual* **__Markdown__** inside of them.'
			    }
			  ],
			  timestamp: new Date(),
			  footer: {
			    icon_url: bot.user.avatarURL,
			    text: '© Example'
			  }
			}});
			break;

		case "team":
			// team join
			if (args[1] === "join") {
				// team is not specified
				if (typeof args[2] === "undefined") {
					message.channel.send("SPECIFY TEAM");
					log(message.author, "Ran Command \"team join\"", null, message.channel, ["Error", "No Team Specified"]);
					break;
				}
				// team is specified
				else {
					var teamName = message.content.substring(args[0].length + args[1].length + 3).split(" ").join(" ").toLowerCase();
					// team doesn't exist yet
					if (message.member.guild.roles.find("name", teamName) === null) {
						message.member.guild.createRole({
							color: generateHex(),
							hoist: true,
							mentionable: true,
							name: teamName,
							permissions: []
						}).then(function(role) {
							message.member.addRole(role);
							var team = message.member.guild.roles.find("name", teamName);
							var userdata = JSON.parse(fs.readFileSync("./userdata.json", "utf8"));
							userdata[message.author.id].team = team.id;
							saveJSON("./userdata.json", userdata);
							message.channel.send("<@" + message.author.id + "> joined team <@&" + team.id + ">");
							log(message.author, "Ran Command \"team join\"", null, message.channel, ["Team Tag", "<@&" + team.id + ">"], ["Team Name", team.name], ["Team ID", team.id]);
						});
						break;
					}
					// team does exist
					else {
						var team = message.member.guild.roles.find("name", teamName);
						message.member.addRole(team);
						var userdata = JSON.parse(fs.readFileSync("./userdata.json", "utf8"));
						userdata[message.author.id].team = team.id;
						saveJSON("./userdata.json", userdata);
						message.channel.send("<@" + message.author.id + "> joined team <@&" + team.id + ">");
						log(message.author, "Ran Command \"team join\"", null, message.channel, ["Team Tag", "<@&" + team.id + ">"], ["Team Name", team.name], ["Team ID", team.id]);
					};
					break;
				};
			}
			// team leave
			if (args[1] === "leave") {
				var userdata = JSON.parse(fs.readFileSync("./userdata.json", "utf8"));
				if (userdata[message.author.id].team > 0) {
					var team = message.member.guild.roles.find("id", userdata[message.author.id].team);
					// last member is leaving
					if (team.members.size === 1) {
						log(message.author, "Ran Command \"team leave\"", null, message.channel, ["Team Tag", "<@&" + team.id + ">"], ["Team Name", team.name], ["Team ID", team.id]);
						message.channel.send("<@&" + team.id + "> has been deleted because <@" + message.author.id + "> was the last person to left").then(function(deleteTeam) {
							team.delete();
						}).then(function(resetTeam) {
							delete userdata[message.author.id].team;
						}).then(function(saveData) {
							saveJSON("./userdata.json", userdata);
						});
						break;
					}
					// last member is not leaving
					else {
						message.member.removeRole(team);
						message.channel.send("<@" + message.author.id + "> left team <@&" + team.id + ">");
						log(message.author, "Ran Command \"team leave\"", null, message.channel, ["Team Tag", "<@&" + team.id + ">"], ["Team Name", team.name], ["Team ID", team.id]);
						delete userdata[message.author.id].team;
						saveJSON("./userdata.json", userdata);
						break;
					};
				}
				else {
					message.channel.send("YOU'RE NOT IN A TEAM");
					log(message.author, "Ran Command \"team leave\"", null, message.channel, ["Error", "No Team To Leave"])
				};
			}
			else {
				message.channel.send("USE LIKE TIS");
				log(message.author, "Ran Command \"team\"", null, message.channel, ["Error", "Invalid Subcommand"])
				break;
			};
			break;

		// invalid command
		default:
			message.channel.send("INVALID COMMAND");
			if (args.join().length > 0) {
				log(message.author, "Invalid Command", null, message.channel, ["Command", args.join(" ")]);
			}
			else {
			log(message.author, "Invalid Command", "No Command", message.channel)
			}
		}
});

bot.login(token);
