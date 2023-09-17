const fs = require("fs");

function getstripModel() {
  let data = fs.readFileSync("data/submenus/Home.json");
  let menu = JSON.parse(data);
  //slet string='Home';
  return menu.stripItems;
  
}

module.exports = getstripModel;
 