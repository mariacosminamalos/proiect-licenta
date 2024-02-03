const fs = require("fs");

function getstripModel() {
  let data = fs.readFileSync("data/submenus/Home.json");
  let menu = JSON.parse(data);
  return menu.stripItems;
  
}

module.exports = getstripModel;
 