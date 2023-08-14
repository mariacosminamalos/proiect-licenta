/*const request = require('request');

const options = {
  method: 'GET',
  url: 'https://travel-advisor.p.rapidapi.com/hotels/list-in-boundary',
  qs: {
    bl_latitude: '11.847676',
    bl_longitude: '108.473209',
    tr_longitude: '109.149359',
    tr_latitude: '12.838442',
    limit: '30',
    currency: 'USD',
    subcategory: 'hotel,bb,specialty',
    adults: '1'
  },
  headers: {
    'X-RapidAPI-Key': '0a2e6ed172msh612643b5b257239p16fceejsna878ce79611b',
    'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
  }
};



request(options, function (error, response, body) {
	if (error) throw new Error(error);

    const response2 = JSON.parse(body);
    const datahotel = response2['data'];

	console.log(datahotel[0].location_id);
});
*/



/*
const request = require('request');

const options = {
  method: 'GET',
  url: 'https://booking-com.p.rapidapi.com/v1/hotels/locations',
  qs: {
    name: 'mykonos',
    locale: 'en-gb'
  },
  headers: {
    'X-RapidAPI-Key': '0a2e6ed172msh612643b5b257239p16fceejsna878ce79611b',
    'X-RapidAPI-Host': 'booking-com.p.rapidapi.com'
  }
};

request(options, function (error, response, body) {
	if (error) throw new Error(error);

  const response2 = JSON.parse(body);

	

	console.log(response2);
});*/

/*
const axios = require('axios');

// Functia pentru a cauta locatii dupa nume
async function searchLocations(locationName) {
  const apiKey = '0a2e6ed172msh612643b5b257239p16fceejsna878ce79611b'; // Inlocuieste cu cheia ta de autentificare API
  const endpoint = 'https://booking-com.p.rapidapi.com/v1/hotels/locations';

  const headers = {
    'X-RapidAPI-Key': '0a2e6ed172msh612643b5b257239p16fceejsna878ce79611b',
    'X-RapidAPI-Host': 'booking-com.p.rapidapi.com'
  };

  const params = {
    name: locationName,
    locale: 'en-gb'
  };

  try {
    const response = await axios.get(endpoint, { headers, params });
    const locations = response.data.result;

    console.log(response.data); // Afiseaza intregul raspuns al API-ului

    if (locations && locations.length > 0) {
      // Parcurge locatiile si afiseaza ID-urile
      locations.forEach((location) => {
        const locationId = location.location_id;
        console.log(locationId);
      });
    } else {
      console.log('Nu s-au gasit locatii valide pentru', locationName);
    }
  } catch (error) {
    console.error('A aparut o eroare:', error.message);
  }
}

// Exemplu de utilizare: cautarea locatiilor dupa nume
searchLocations('Greece');
*/

const request = require('request');
async function searchLocations(city) {
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
	if (error) throw new Error(error);

  const response2 = JSON.parse(body);
	console.log(response2);
});}

searchLocations('Istambul');