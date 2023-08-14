/*const request = require('request');

async function searchFlights(city) {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'GET',
      url: 'https://travel-advisor.p.rapidapi.com/flights/create-session',
      qs: {
        city: city,
        api_key: '0a2e6ed172msh612643b5b257239p16fceejsna878ce79611b'
      },
    };

    request(options, function (error, response, body) {
      if (error) {
        reject(error);
      } else {
        const flights = JSON.parse(body);
        console.log(flights);
        resolve(flights);
      }
    });
  });
}

module.exports = searchFlights;

*/

/*
const request = require('request');

const options = {
  method: 'GET',
  url: 'https://travel-advisor.p.rapidapi.com/flights/create-session',
  qs: {
    o1: 'DMK',
    d1: 'CNX',
    dd1: '2023-03-15',
    currency: 'RON',
    ta: '1',
    c: '0'
  },
  headers: {
    'X-RapidAPI-Key': '0a2e6ed172msh612643b5b257239p16fceejsna878ce79611b',
    'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
  }
};

request(options, function (error, response, body) {
	if (error) throw new Error(error);

	const flights = JSON.parse(body);
  console.log(flights.summary);
  
});

*/
/*
const axios = require('axios');
const { response } = require('express');


async function getFlightsInfo(origin, destination, departureDate) {
  try {
    const response = await axios.get('https://travel-advisor.p.rapidapi.com/airports/search', {
      params: {
        o1: origin,
        d1: destination,
        dd1: departureDate,
      },
      headers: {
        'X-RapidAPI-Key': '0a2e6ed172msh612643b5b257239p16fceejsna878ce79611b',
        'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
      }
    });

    return response.data;
  } catch (error) {
    console.error('A apărut o eroare:', error);
    throw new Error('Eroare la preluarea datelor de zbor.');
  }
}

module.exports = getFlightsInfo;

*/

const axios = require('axios');
const xml2js = require('xml2js');

async function getFlightsInfo(origin, destination, departureDate) {
  try {
    const url = `https://timetable-lookup.p.rapidapi.com/TimeTable/${origin}/${destination}/${departureDate}`;
    
    const response = await axios.get(url, {
      headers: {
        'X-RapidAPI-Key': '0a2e6ed172msh612643b5b257239p16fceejsna878ce79611b',
        'X-RapidAPI-Host': 'timetable-lookup.p.rapidapi.com'
      }
    });

    const xml = response.data;

    const parser = new xml2js.Parser();
    
    return new Promise((resolve, reject) => {
      parser.parseString(xml, (err, parsedResponse) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(parsedResponse);
        }
      });
    });
  } catch (error) {
    console.error('A apărut o eroare:', error);
    throw error;
  }
}

module.exports = getFlightsInfo;
