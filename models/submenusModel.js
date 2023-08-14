const fs = require("fs");

function getsubmenusModel() {
  let data = fs.readFileSync("data/menus.json");
  let menu = JSON.parse(data);
  return menu.submenuItems;
}

module.exports = getsubmenusModel;
