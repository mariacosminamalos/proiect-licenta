const request = require('request');

async function searchLocations(city) {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'GET',
      url: 'https://booking-com.p.rapidapi.com/v1/hotels/locations',
      qs: {
        name: city,
        locale: 'en-gb'
      },
      headers: {
        'X-RapidAPI-Key': '0a2e6ed172msh612643b5b257239p16fceejsna878ce79611b',
        'X-RapidAPI-Host': 'booking-com.p.rapidapi.com'
      }
    };

    request(options, function (error, response, body) {
      if (error) {
        reject(error);
        return;
      }

      const data = JSON.parse(body);
      const locations = data.map((item) => ({
         name: item.name,
        image_url: item.image_url,
        region: item.region,
        country: item.country,
        nr_hotels: item.nr_hotels,
        timezone: item.timezone,
        dest_type: item.dest_type,
        latitude: item.latitude,
        longitude: item.longitude
      }));

      resolve(locations);
    });
  });
}

module.exports = searchLocations;