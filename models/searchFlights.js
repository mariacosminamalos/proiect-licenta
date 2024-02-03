
const axios = require('axios');

async function getFlightsInfo(origin, destination, departureDate, adults, cabinClass) {
  console.log('Parameters:', { origin, destination, departureDate, adults, cabinClass });
  try {
    const url = `https://booking-com15.p.rapidapi.com/api/v1/flights/searchFlights`;

    const response = await axios.get(url, {
      params: {
        fromId: origin + '.AIRPORT',
        toId: destination + '.AIRPORT',
        departDate: departureDate,
        adults: adults,
        cabinClass: cabinClass,
        currency_code: 'EUR'
      },
      headers: {
        'X-RapidAPI-Key': '0a2e6ed172msh612643b5b257239p16fceejsna878ce79611b',
        'X-RapidAPI-Host': 'booking-com15.p.rapidapi.com'
      }
    });

return response.data;

} catch (error) {
  if (error.response) {
    console.error('Status code:', error.response.status);
    console.error('Data:', error.response.data);
  } else if (error.request) {
    console.error('No response received');
  } else {
    console.error('Error:', error.message);
  }

  throw new Error('Eroare la preluarea datelor de zbor.');
}
}

module.exports = getFlightsInfo;
