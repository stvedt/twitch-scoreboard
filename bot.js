var tmi = require("tmi.js");

module.exports = function (){

  // Do NOT include this line if you are using the built js version!
  var chatChannels = ["#norwegiansven"];

  var options = {
      options: {
          debug: true
      },
      connection: {
          reconnect: true
      },
      identity: {
          username: "streamscores",
          password: process.env.TWITCH_OAUTH_KEY
      },
      channels: chatChannels
  };

  var client = new tmi.client(options);
  // Connect the client to the server..
  client.connect();

  client.on("chat", function(channel, user, message, self) {
      /*
      var justUser = channel.substring(1);

      if(typeof usersData.find(function (res) { return res.name === justUser; }) == "undefined"){
          newChannel(justUser);
          return;
      }

      var currentScrimID = usersData.find(function (res) { return res.name === justUser; }).currentScrim;

      //determing player team and opponent
      var teamName = usersData.find(function (res) { return res.name === justUser; }).team;
      var playerTeam = teamsData.find(function (res) { return res.name === teamName; });

      var opponentsTeamName, teamNames;

      if(currentScrimID !== ""){
          teamNames = helpers.getTeams(currentScrimID);
          for(i=0; i<=1; i++){
              if (teamNames[i] !== playerTeam){
                  opponentsTeamName = teamNames[i];
              }
          }
      }
      */

      //mod only:
      if(user["user-type"] === "mod") {}

          console.log( 'user' + user );

      // Make sure the message is not from the bot..
      if (!self) {
          var split = message.toLowerCase().split(" ");
          // if(usersData.find(function (res) { return res.name === justUser; }).team == "" && split[0] !=="!setteam" && user.username == justUser){
          //     client.say(channel, "Team must be set using. !setteam");
          //     return;
          // }

          switch (split[0]) {
              case "!commands":
                  client.say(channel, "http://prohalostats.com/bot/");
                  break;
              case "!join":
                  if(channel == "#norwegiansven"){
                      var channelJoin = '#' + user.username;
                      client.join(channelJoin);
                  }
                  break;
              case "!setteam":
                  // var newTeamName = message.substring(9);
                  // var result = setTeam(justUser, newTeamName);
                  // client.say(channel, result);
                  client.say(channel, "!setteam processed");
                  break;
              case "!win":
                  // var result = logWin(currentScrimID, teamName);
                  // client.say(channel, result);
                  client.say(channel, "!win processed");
                  break;
              case "!loss":
                  // var result = logLoss(currentScrimID, opponentsTeamName);
                  client.say(channel, "!loss");
                  break;
              case "!newseries":
                  // var newOpponentName = message.substring(11);
                  // var result = newScrim( justUser, teamName, newOpponentName);
                  client.say(channel, "!newseries");
                  break;
              case "!finishseries":
                  // var finishString = finishScrim(currentScrimID, teamName, opponentsTeamName, justUser);
                  client.say(channel, "!finishseries");
                  break;
              case "!score":
                  // var scoreString = getScore(currentScrimID, teamName, opponentsTeamName);
                  client.say(channel, "!score");
                  break;
              case "!getteams":
                  // var teamsString = getAllTeams();
                  client.say(channel, "!getteams");
                  break;
              case "!playerstats":
                  client.say(channel, "http://prohalostats.com/bot/user/"+justUser+"/");
                  break;
          }
      }
  });

}
