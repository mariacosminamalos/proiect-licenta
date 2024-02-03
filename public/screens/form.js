let getFlightsInfo; 
let selectedClassFilter = '';
let selectedStopsFilter = '';
let selectedCompanyFilter = '';
let minPriceFilter = '';
let maxPriceFilter = '';
let flightTokens = [];
let showResults = false;

document.addEventListener('DOMContentLoaded', () => {

  const form = document.getElementById('flightForm');
  const flightsResult = document.getElementById('flightsResult');
  
  
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const origin = document.getElementById('origin').value;
    const destination = document.getElementById('destination').value;
    const departureDate = document.getElementById('departureDate').value;
    const adults = document.getElementById('adults').value;
    const cabinClass = document.getElementById('cabinClass').value;
  

    try {
      const response = await fetch('/screens/zboruri', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ origin, destination, departureDate, adults, cabinClass}),
      });
    
      if (response.ok) {
        const json = await response.json();
    
        displayFlightsResults(json.flights);
        displayFilters(json.flights.flightDeals, json.flights.flightOffers);
        
        console.log(json.flights.flightDeals);
        
      } else {
        console.error('A apărut o eroare la preluarea datelor de zbor.');
        console.error('Status:', response.status);
        const errorMessage = await response.text();
        console.error('Error message:', errorMessage);
        flightsResult.innerHTML = '<p>A apărut o eroare la preluarea datelor de zbor.</p>';
      }
    } catch (error) {
      console.error(error);
      flightsResult.innerHTML = '<p>A apărut o eroare la preluarea datelor de zbor.</p>';
    }
  });

  

  function displayFilters(json, flightOffers) {
    const filtersContainer = document.getElementById('filters-container');
   
    if (filtersContainer) {
      filtersContainer.innerHTML = `
      <div id="filters">
      <div class="filter-group">
        <label for="stopsFilter">Filtrează după opriri:</label>
        <select id="stopsFilter">
          <option value="">Fara oprire</option>
        </select>
      </div>
    
      <div class="filter-group">
        <label for="minPrice">Preț minim:</label>
        <input type="number" id="minPrice" placeholder="Minim">
      </div>
    
      <div class="filter-group">
        <label for="maxPrice">Preț maxim:</label>
        <input type="number" id="maxPrice" placeholder="Maxim">
      </div>
    
      <div class="filter-group">
        <label for="companyFilter">Filtrează după companie:</label>
        <select id="companyFilter">
          <option value="">Toate companiile</option>
          <option value="Wizz Air Malta">Wizz Air Malta</option>
          <option value="KLM">KLM</option>
          <option value="Air Serbia">Air Serbia</option>
          <option value="Lufthansa">Lufthansa</option>
          <option value="Austrian Airlines">Austrian Airlines</option>
          <option value="Turkish Airlines">Turkish Airlines</option>
          <option value="Easyjet">Easyjet</option>
          <option value="Wizz Air UK">Wizz Air UK</option>
          <option value="Wizz Air">Wizz Air</option>
          <option value="Qatar Airways">Qatar Airways</option>
          <option value="Tarom">Tarom</option>
        </select>
      </div>
    
      <button id="filterButton">Filtrează</button>
    </div>
    
      `;
    } else {
      console.error('Elementul cu id-ul "filters-container" nu a fost găsit.');
 
    }

    const filterButton = document.getElementById('filterButton');
  
    filterButton.addEventListener('click', () => {
      selectedStopsFilter = document.getElementById('stopsFilter').value;
      selectedCompanyFilter = document.getElementById('companyFilter').value;
      minPriceFilter = document.getElementById('minPrice').value !== '' ? parseFloat(document.getElementById('minPrice').value) : null;
      maxPriceFilter = document.getElementById('maxPrice').value !== '' ? parseFloat(document.getElementById('maxPrice').value) : null;
  
      applyFilters();
    });
  
    const recommendationButtonsContainer = document.getElementById('recommandationButton');
      recommendationButtonsContainer.innerHTML = `
        <a id="filterCheapest" class="recommendation-button">CEL MAI IEFTIN</button>
        <a id="filterFastest" class="recommendation-button">CEL MAI RAPID</button>
        <a id="filterBest" class="recommendation-button">CEL MAI BUN</button>
      `;

    const filterCheapestButton = document.getElementById('filterCheapest');
    const filterFastestButton = document.getElementById('filterFastest');
    const filterBestButton = document.getElementById('filterBest');

    filterCheapestButton.addEventListener('click', () => {
      const cheapestOffer = getCheapestOffer(flightOffers);
    
      if (cheapestOffer) {
        displayCheapestFl(cheapestOffer);
      } else {
      }
    });

    function displayCheapestFl(flightInfo) {
      const flightElement = createFlightElement(flightInfo);
      const flightsResult = document.getElementById('flightsResult');
      flightsResult.innerHTML = '';
      flightsResult.appendChild(flightElement);
    }
    
    filterFastestButton.addEventListener('click', () => filterByRecommendation('FASTEST', json, flightOffers));
    filterBestButton.addEventListener('click', () => filterByRecommendation('BEST', json, flightOffers));
    
  
    document.getElementById('filterCheapest').addEventListener('click', function() {
      scrollToSection('sectionCheapest');
    });

    document.getElementById('filterFastest').addEventListener('click', function() {
      scrollToSection('sectionFastest');
    });

    document.getElementById('filterBest').addEventListener('click', function() {
      scrollToSection('sectionBest');
    });

    function scrollToSection(sectionId) {
      const section = document.getElementById(sectionId);

      if (section) {
        section.scrollIntoView({
          behavior: 'smooth'
        });

      
        document.querySelectorAll('.recommendation-button').forEach(btn => {
          btn.classList.remove('active');
        });

      
        document.getElementById('filter' + sectionId.charAt(7).toUpperCase() + sectionId.slice(8)).classList.add('active');
      }
    }
      
    }


    function applyFilters() {
    
      const flightElements = document.querySelectorAll('.flight');
      
      flightElements.forEach((flightElement) => {
        const flightStopsText = flightElement.querySelector('.flight-stops')?.innerText || '';
        const flightStops = parseInt(flightStopsText) || 0;
        const flightPriceText = flightElement.querySelector('.flight-price')?.innerText || '';
        const flightPrice = parseFloat(flightPriceText.replace(/[^\d.]/g, '')) || 0;
        const companyElement = flightElement.querySelector('.company-name');
        
        const companyName = companyElement ? companyElement.innerText : '';
        console.log(companyName);
        const filtersContainer = document.getElementById('filters-container');

      if (filtersContainer) {
        const stopsFilterPassed = selectedStopsFilter === '' || flightStops === parseInt(selectedStopsFilter);
        const priceFilterPassed = (minPriceFilter === null || flightPrice >= minPriceFilter) &&
                                  (maxPriceFilter === null || flightPrice <= maxPriceFilter);
        const companyFilterPassed = selectedCompanyFilter === '' || companyName === selectedCompanyFilter;

        console.log('Companie:' + selectedCompanyFilter);
        console.log(companyFilterPassed);
        flightElement.style.display = stopsFilterPassed && priceFilterPassed && companyFilterPassed ? 'block' : 'none';
      } else {
        console.error('Elementul cu id-ul "filters-container" nu a fost găsit.');
      }
    });
  }

  function filterByRecommendation(recommendation, flightDeals, flightOffers) {
    
    const token = getRecommendationToken(recommendation, flightDeals);
    console.log('Token:', token);  

    displayRecomandationFlights(token, flightOffers);
  }

  function getRecommendationToken(recommendation, flightDeals) {
    
    console.log(flightDeals);
    for (const deal of flightDeals) {
      if (deal.key === recommendation) {
        return deal.offerToken;
      }
    }
  
    return null;
  }

  function displayRecomandationFlights(token, flightOffers) {
    
    if (!token) {
      return;
    }

    const flightsResult = document.getElementById('flightsResult');
    flightsResult.innerHTML = '';
    
    flightOffers.forEach((flightInfo) => {
      const flightToken = flightInfo.token;
      const flightElementHTML = createFlightElement(flightInfo);
  
      console.log('Flight token for element:', flightToken);
  
      if (flightToken === token) {
        console.log('Match found. Setting display to "block".');
        flightsResult.appendChild(flightElementHTML);
      } else {
        console.log('No match found. Removing element.');
        const existingElement = flightsResult.querySelector(`[data-token="${flightToken}"]`);
        if (existingElement) {
          flightsResult.removeChild(existingElement);
        }
      }
    });
  }

  function showMoreDetails(
    departureName,
    departureCityName,
    departureCountryName,
    depTime,
    arrivalName,
    arrivalCityName,
    arrivalCountryName,
    arrTime
  ) {
    const modalContent = document.getElementById('modal-content');
    
    const details =
      `Departure Name: ${departureName} </br>
      Departure City: ${departureCityName} </br>
      Departure Country: ${departureCountryName} </br>
      Departure Time: ${depTime} </br>
      </br>
      Arrival Name: ${arrivalName} </br>
      Arrival City: ${arrivalCityName} </br>
      Arrival Country: ${arrivalCountryName} </br>
      Arrival Time: ${arrTime} </br>`;
  
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '&times;';
    closeButton.className = 'close';
    closeButton.addEventListener('click', closeModal);
    modalContent.innerHTML = details;
    modalContent.appendChild(closeButton);
  
    const modal = document.getElementById('modal');
    modal.style.display = 'block';
  
  }


  
  function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
  }
  

  function createFlightElement(flightInfo) {
    const flightElement = document.createElement('div');
    flightElement.classList.add('flight');
  
    const firstSegment = flightInfo.segments[0];
    const depAirport = firstSegment.departureAirport;
    const arrAirport = firstSegment.arrivalAirport;
    const depTime = (firstSegment.departureTime).slice(11, -3);
    const arrTime = (firstSegment.arrivalTime).slice(11,-3);
  
    const departureCode = depAirport.code;
    const departureName = depAirport.name;
    const departureCityName = depAirport.cityName;
    const departureCountryName = depAirport.countryName;
  
    const arrivalCode = arrAirport.code;
    const arrivalName = arrAirport.name;
    const arrivalCityName = arrAirport.cityName;
    const arrivalCountryName = arrAirport.countryName;
  
    const priceBr = flightInfo.priceBreakdown;
    const priceNanos = priceBr.total.nanos;
    const priceDecimalPart = String(priceNanos).slice(0, 2);
    const price = priceBr.total.units + '.' + priceDecimalPart + '' + priceBr.total.currencyCode;
  
    const cabinClass = firstSegment.legs[0].cabinClass;
    const company = firstSegment.legs[0].carriersData[0];
    const companyName = company.name;
    
    const flightDetailsContainer = document.createElement('div');
    flightDetailsContainer.innerHTML = `
      </br>
      </br>
      <div class="flight-container">
        <div class="flight-details">
          <div class="origin-destination">
            <div class="origin">${departureCode}</div>
            <div class="arrow">➔</div>
            <div class="destination">${arrivalCode}</div>
          </div>
          <div class="time1-time2">
            <div class="time1">${depTime}</div>
            <div class="time2">${arrTime}</div>
          </div>
          <div class="horizontal-line"></div>
          <div class="price-zbdir">
            <div class="flight-price">${price} </div> </br>
            <div class="zbdir"> Zbor Direct </div>
          </div>  
          <div class="cabin-class">Clasa:${cabinClass}</div>
          <div class="company-name">${companyName}</div> 
          
        </div>
        <button class="view-more"> Vezi mai multe info.. </button>
        <div id="modal" class="modal">
          <div id="modal-content" class="modal-content"></div>
          <button id="closeModalButton" class="close" onclick="closeModal()">&times;</button>
        </div>
        
      </div>
      `;
      flightElement.appendChild(flightDetailsContainer);
  

    const viewMoreButton = flightDetailsContainer.querySelector('.view-more');
    viewMoreButton.addEventListener('click', function() {
      showMoreDetails(
        departureName,
        departureCityName,
        departureCountryName,
        depTime,
        arrivalName,
        arrivalCityName,
        arrivalCountryName,
        arrTime
      );
    });


    
    return flightElement;
  }


  
  

  function displayFlightsResults(flights) {
    const flightsResult = document.getElementById('flightsResult');
    
    if (flights && flights.flightOffers && Array.isArray(flights.flightOffers)) {
      showResults = true;
      const flightOffers = flights.flightOffers;
  
      if (flightOffers.length === 0) {
        flightsResult.innerHTML = '<p>Nu s-au găsit zboruri pentru aceste criterii.</p>';
        return;
      }
  
      flightOffers.forEach((flightInfo) => {
        console.log('Flight Info:', flightInfo);
        const flightElement = createFlightElement(flightInfo);
        flightsResult.appendChild(flightElement); 
      });
    } else {
      flightsResult.innerHTML = '<p>Nu s-au găsit zboruri pentru aceste criterii.</p>';
    }
  }


  function getCheapestOffer(flightOffers) {
    if (!flightOffers || flightOffers.length === 0) {
      return null;
    }
  
    let cheapestOffer = flightOffers[0]; 
  
    for (let i = 1; i < flightOffers.length; i++) {
      const currentOffer = flightOffers[i];
  
     
      if (currentOffer.priceBreakdown.total.units < cheapestOffer.priceBreakdown.total.units) {
        cheapestOffer = currentOffer;
      }
    }
  
    return cheapestOffer;
  }
})

