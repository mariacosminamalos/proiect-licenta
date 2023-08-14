const fs = require('fs');

function getContentById(id) {
  const data = fs.readFileSync('data/submenus/Home.json')
  const jsonData = JSON.parse(data);

  const allContent = jsonData.stripItems.reduce((result, item) => {
    return [...result, ...item.shows];
  }, []);

  return allContent.find(item => { 
    return item.id === id });
}


module.exports = getContentById;