Twitch Scoreboard
=================

## Local Environment Setup

To run locally you must have the following installed:
- [NodeJS](https://nodejs.org/en/download/)
- [MongoDB](https://treehouse.github.io/installation-guides/mac/mongo-mac.html) (installation instructions on Mac)
- [NPM (Node Package Manager)](https://www.npmjs.com/get-npm) (installed with NodeJS)
- Heroku CLI


#### Running Locally:
Start MongoDB (in own terminal window)
`mongod`

Make sure NodeJS dependencies are installed with NPM. (only run this if dependencies have changed)
`npm install`

Local Run with Heroku
`heroku local web`

## Deploying with Heroku
Commit all of your code and be sure they are in a branch.

Deploy:
`git push heroku master`

Check instance is running(optional):
`heroku ps:scale web=1`

Open page in web browser (or just navigate to decisionmakingtask.com):
`heroku open`

View Logs (should something on the server side goes wrong):
`heroku logs --tail`


## Nest Steps
- Authentication via Twitch
- Create User View
- Create ChatBot Commands
- Hook up MongoDB

## Features to Adds
- Update Nav to newer bootstrap version. Later replace with Material Design
- Create Score View in React and update with Socket.io
- Add ChatBot Interface with TMI.js
- Authentication via Twitch.



## To Fix

- Only runs locally on Port 5000. Investigate.
