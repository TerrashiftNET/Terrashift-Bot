# Terrashift-Bot

This bot servers as a communication layer between bluemap and discord, allowing for creation of markers. It also serves as a way to lock/unlock our creative server in order to stop updates. 

## Setup
Prerequisites: 
- Node.js

Simply clone this repo and rename ``config.json.example`` to ``config.json``, filling in all the fields neccessary. Install dependencies with ``npm i`` and start using ``npm start``
### Config
```json
{
  "token":"TOKEN HERE",
  "clientId":"CLIENT ID",
  "guildId":"GUILD ID",
  "ptero_token":"PTERODACTYL TOKEN",
  "server_id":"SERVER ID",
  "creative_server_id":"CREATIVE SERVER ID"
}
```
