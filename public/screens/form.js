const form = document.getElementById('flightForm');
const flightsResult = document.getElementById('flightsResult');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const origin = document.getElementById('origin').value;
  const destination = document.getElementById('destination').value;
  const departureDate = document.getElementById('departureDate').value;

  console.log(origin);
  console.log(destination);
  console.log(departureDate);


  try {
    const response = await fetch('/screens/zboruri', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `origin=${origin}&destination=${destination}&departureDate=${departureDate}`
    });

    if (response.ok) {
      const json = await response.json();
  
      console.log(json);
      
      if (json && json.flights) {
        displayFlightsResults(json.flights);
      } else {
        flightsResult.innerHTML = '<p>Nu s-au găsit zboruri pentru aceste criterii.</p>';
      }
    } else {
      console.error('A apărut o eroare la preluarea datelor de zbor.');
  
      // Afișați mai multe detalii despre eroare
      console.error('Status:', response.status);
      const errorMessage = await response.text();
      console.error('Error message:', errorMessage);
    }
  } catch (error) {
    console.error(error);
    flightsResult.innerHTML = '<p>A apărut o eroare la preluarea datelor de zbor.</p>';
  }
});

function displayFlightsResults(flights) {
  flightsResult.innerHTML = '<h2>Rezultatele căutării:</h2>';

  console.log(flights);
  console.log('Flights array:', flights)
  if (Array.isArray(flights)) {
    flights.forEach(flightInfo => {
      const departureCode = flightInfo["$"].FLSDepartureCode;
      const arrivalCode = flightInfo["$"].FLSArrivalCode;
      const departureName = flightInfo["$"].FLSDepartureName;
      const arrivalName = flightInfo["$"].FLSArrivalName;
      const flightType = flightInfo["$"].FLSFlightType;
  
      const departureDateTime = flightInfo.FlightLegDetails[0]["$"].DepartureDateTime;
      const arrivalDateTime = flightInfo.FlightLegDetails[flightInfo.FlightLegDetails.length - 1]["$"].ArrivalDateTime;
      const flightNumber = flightInfo.FlightLegDetails[0]["$"].FlightNumber;
      const journeyDuration = flightInfo["$"].TotalFlightTime;
  
      const flightElement = document.createElement('div');
      flightElement.classList.add('flight');
  
      const flightDetails = document.createElement('p');
      flightDetails.innerHTML = `
        Departure: ${departureCode} - ${departureName}<br>
        Arrival: ${arrivalCode} - ${arrivalName}<br>
        Flight Type: ${flightType}<br>
        Flight Number: ${flightNumber}<br>
        Departure Time: ${departureDateTime}<br>
        Arrival Time: ${arrivalDateTime}<br>
        Duration: ${journeyDuration}
      `;
  
      flightElement.appendChild(flightDetails);
      flightsResult.appendChild(flightElement);
    });
  } else {
    flightsResult.innerHTML = '<p>Nu s-au găsit zboruri pentru aceste criterii.</p>';
  }
  
}
