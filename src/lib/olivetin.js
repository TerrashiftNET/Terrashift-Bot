const https = require("https");
const { olivetinUserName, olivetinPass } = require("../config.json");

const options = {
  hostname: "http://localhost:1337",
  path: "/api",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

const data = JSON.stringify({
  username: `${olivetinUserName}`,
  password: `${olivetinPass}`,
});

export function login() {
  const req = https
    .request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        console.log(JSON.parse(data));
      });
    })
    .on("error", (err) => {
      console.log("Error: ", err.message);
    });
}

module.exports = {
  login,
};
