# express-server
Exploring Express server setup and features

Using Node v6.9.4

Sample config.js file not included in repo:
const config = {
  "development": {
    "database": {
      "url": "mongodb://USERNAME:PASSWORD@MONGODB_LOCATION"
    },
    "server": {
      "http": "3000",
      "https": "3001",
      "key": "/server.key",
      "cert": "/server.crt"
    }
  },
  "production": {
  //ETC
  }
}
module.exports = config;