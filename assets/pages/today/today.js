/*==================== UPDATE MAIN PAGE BUTTONS ====================*/

// Update Main Page Today's Forecast "Next Hours" button
function updateNextHoursButton(city) {
  const nextHoursButton = document.querySelector('.todays__forecast_button');
  nextHoursButton.innerHTML = `<a href="../../../assets/pages/hourly/hourly.html?city=${city}">Next Hours</a>`;
};

// Update Main Page Hourly Forecast "Next 48 Hours" button
function updateNext48HoursButton(city) {
  const next48HoursButton = document.querySelector('.hourly__forecast_button');
  next48HoursButton.innerHTML = `<a href="../../../assets/pages/hourly/hourly.html?city=${city}">Next 48 Hours</a>`;
};

// Update Main Page Daily Forecast "Next 7 Day" button
function updateNextSevenDaysButton(city) {
  const nextSevenDaysButton = document.querySelector('.daily__forecast_button');
  nextSevenDaysButton.innerHTML = `<a href="../../../assets/pages/sevenday/sevenday.html?city=${city}">Next 7 Day</a>`;
};

// Update Main Page buttons
function updateMainPageButtons(city) {
  updateNextHoursButton(city);
  updateNext48HoursButton(city);
  updateNextSevenDaysButton(city);
}

/*==================== ICONS AND TEXT ====================*/

// Condition Text and Icons
const conditionText = document.getElementById('condition-text');
const conditionIcon = document.querySelectorAll('.condition-icon');
const icons = {
  "Light rain": `<i class="uil uil-cloud-rain"></i>`,
  "Sunny": `<i class="uil uil-brightness"></i>`,
  "Mist": `<i class="uil uil-clouds"></i>`,
  "Overcast": `<i class="uil uil-cloud"></i>`,
  "Moderate rain": `<i class="uil uil-cloud-rain"></i>`,
  "Partly cloudy": `<i class="uil uil-cloud-sun"></i>`,
  "Clear": `<i class="uil uil-moon"></i>`,
  "Fog": `<i class="uil uil-cloud-wind"></i>`,
  "Cloudy": `<i class="uil uil-clouds"></i>`,
  "Patchy rain possible": `<i class="uil uil-cloud-sun-rain-alt"></i>`,
  "Light drizzle": `<i class="uil uil-cloud-showers-heavy"></i>`,
  "Light rain shower": `<i class="uil uil-cloud-sun-tear"></i>`,
  "Heavy snow": `<i class="uil uil-cloud-meatball"></i>`,
  "Moderate or heavy snow showers": `<i class="uil uil-cloud-sun-hail"></i>`,
  "Patchy light snow": `<i class="uil uil-cloud-sun-meatball"></i>`,
  "Other": `<i class="uil uil-rainbow"></i>`
};

// Function for showing the Icons depending on the Text
function setConditionIcon(conditionTextData, iconElement) {
  const icon = icons[conditionTextData] || icons.Other;
  iconElement.innerHTML = icon;
}

/*==================== REALTIME SECTION ====================*/

// Get City and Country data
function getCityCountry(data) {
  const cityCountry = document.querySelectorAll('.city-country');
  cityCountry.forEach(node => {
      node.innerHTML = `${data.location.name}, ${data.location.country}`;
  });
}

// Get Realtime Time data
function getRealtimeTime(data) {
  const realtimeTime = document.getElementById('realtime-time');

  const timeString = data.location.localtime;
  const time = new Date(timeString);

  let hours = time.getHours();
  let minutes = time.getMinutes();
  let ampm = 'AM';

  if (hours > 12) {
      hours -= 12;
      ampm = 'PM';
  }

  minutes = minutes < 10 ? `0${minutes}` : minutes;
  realtimeTime.innerHTML = `As of ${hours}:${minutes} ${ampm} CET`;
}

// Get Realtime Temperature data
function getRealtimeTemp(data) {
  const realtimeTemp = document.getElementById('realtime-temp');
  const currentTemp = data.current.temp_c;
  realtimeTemp.innerHTML = `${Math.round(currentTemp)}°`;
}

// Get Realtime Condition Text data
function getConditionText(data) {
  conditionText.innerHTML = data.current.condition.text;
}

// Get Realtime Condition Icon data
function getConditionIcon(data) {
  const conditionTextData = data.current.condition.text;
  conditionIcon.forEach((iconElement) => {
    setConditionIcon(conditionTextData, iconElement);
  });
}

// Get Realtime Day and Night Temperature data
function getDayNightTemp(data) {
  const dayTemp = document.getElementById('day-temp');
  const nightTemp = document.getElementById('night-temp');

  dayTemp.innerHTML = `${Math.round(data.forecast.forecastday[0].hour[12].temp_c)}°`;
  nightTemp.innerHTML = `${Math.round(data.forecast.forecastday[1].hour[0].temp_c)}°`;
}

/*==================== TODAY'S FORECAST SECTION ====================*/

// Function to generate Today's Forecast section for each time period
function generateTodaysForecastHTML(period, temp, chanceOfRain) {
  return `<div class="todays__forecast_${period} todays__forecast_four-all">
              <p>${period[0].toUpperCase() + period.slice(1)}</p>
              <p id="${period}-temp">${temp}°</p>
              <span class="today-forecast-icon"><i class="uil uil-cloud-sun-rain-alt"></i></span>
              <div class="todays__forecast_rain">
                <span id="${period}-icon"><i class="uil uil-raindrops"></i></span>
                <p class="rain-chance">${chanceOfRain}%</p>
              </div>
            </div>`
}

// Creating an object to store the time period indices
const timePeriods = {
  morning: 6,
  afternoon: 12,
  evening: 18,
  overnight: 0
}

// Get Today's Forecast section data
function getTodaysForecast(data) {
  const todaysForecast = document.querySelector('.todays__forecast_four');

  // Clear the previous data before appending new data
  todaysForecast.innerHTML = "";

  // Iterate through the time periods and append the HTML to the parent div
  for (let period in timePeriods) {
    let temp;
    let chanceOfRain;
    switch (period) {
      case 'overnight':
        temp = Math.round(data.forecast.forecastday[1].hour[timePeriods[period]].temp_c);
        chanceOfRain = data.forecast.forecastday[1].hour[timePeriods[period]].chance_of_rain;
        break;
      default:
        temp = Math.round(data.forecast.forecastday[0].hour[timePeriods[period]].temp_c);
        chanceOfRain = data.forecast.forecastday[0].hour[timePeriods[period]].chance_of_rain;
        break;
    }
    todaysForecast.innerHTML += generateTodaysForecastHTML(period, temp, chanceOfRain);
  }
}

/*==================== WEATHER TODAY SECTION ====================*/

// Get Weather Today section data
function getWeatherToday(data) {
  const feelsLike = document.getElementById('feels-like');
  const maxTemp = document.getElementById('max-temp');
  const minTemp = document.getElementById('min-temp');
  const humidity = document.getElementById('humidity');
  const pressure = document.getElementById('pressure');
  const visibility = document.getElementById('visibility');
  const wind = document.getElementById('wind');
  const dewpoint = document.getElementById('dewpoint');
  const uvIndex = document.getElementById('uv-index');
  const moonPhase = document.getElementById('moon-phase');

  feelsLike.innerHTML = `${Math.round(data.current.feelslike_c)}°`;
  maxTemp.innerHTML = `${Math.round(data.forecast.forecastday[0].day.maxtemp_c)}°`;
  minTemp.innerHTML = `${Math.round(data.forecast.forecastday[0].day.mintemp_c)}°`;
  humidity.innerHTML = `${data.current.humidity}%`;
  pressure.innerHTML = data.current.pressure_in;
  visibility.innerHTML = data.current.vis_km;
  wind.innerHTML = data.current.wind_kph;
  dewpoint.innerHTML = `${data.forecast.forecastday[0].hour[1].dewpoint_c}°`;
  uvIndex.innerHTML = data.current.uv;
  moonPhase.innerHTML = data.forecast.forecastday[0].astro.moon_phase;
}

/*==================== GET WEATHER DATA FUNCTIONS ====================*/

// Constants
const apiKey = '9ce000ab2ee94bf8bfd111052222012';
const apiEndpoint = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&days=10&aqi=yes&alerts=yes`;
const searchForm = document.getElementById('search-form');
const searchParams = new URLSearchParams(window.location.search);

searchForm.addEventListener('submit', getCityValue);

// Get the city name value in search input
function getCityValue(event) {
  event.preventDefault();
  const city = document.getElementById('search-input').value;
  updateSearchParams(city)
  fetchWeatherData(city);
}

//
function updateSearchParams(city) {
  searchParams.set("city", city);
  window.history.pushState({}, "", `${window.location.pathname}?${searchParams.toString()}`);
}

// Fetch Weather data based on city
function fetchWeatherData(city) {
  fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=10&aqi=yes&alerts=yes`)
    .then((response) => response.json())
    .then((data) => {
      updateNavbarLinks(city);
      updateMainPageButtons(city)
      getCityCountry(data);
      getRealtimeTime(data);
      getRealtimeTemp(data);
      getConditionText(data);
      getConditionIcon(data);
      getDayNightTemp(data);
      getTodaysForecast(data);
      getWeatherToday(data);
      // getDailyForecast(data);
    });
}

// Fetch Weather data based on the Geolocation
navigator.geolocation.getCurrentPosition((position) => {
  let lat = position.coords.latitude;
  let lng = position.coords.longitude;

  // Fetch weather data based on current location
  fetch(`https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lng}&days=10&aqi=yes&alerts=yes`)
    .then((response) => response.json())
    .then((data) => {
      const city = data.location.name;
      if(localStorage.getItem('city') && localStorage.getItem('city') === city && window.location.search) return
      // Set city name in input field
      document.getElementById("search-input").value = city;
      localStorage.setItem('city', city);
      // Update the URL with the city value
      updateSearchParams(city);
      fetchWeatherData(city);
    });
}, (error) => {
    console.log(error);
});

// Get the city name from the URL
const cityFromUrl = searchParams.get("city");
if (cityFromUrl) {
  document.getElementById("search-input").value = cityFromUrl;
  fetchWeatherData(cityFromUrl);
}

/*==================== AUTOCOMPLETE SEARCH FORM ====================*/

// Declaring an array that contains a list of cities
let searchable = ["London", "Pristina", "Moscow", "Paris", "Berlin", "Berne", "Sofia", "Madrid", "Ljubljana", "Tirana", "Sarajevo", "Athens", "Rome", "Zagreb", "Stockholm",
"Valletta", "Chisinau", "Skopje", "Luxembourg", "Vilnius", "Vaduz", "Riga", "Dublin", "Reykjavik", "Budapest", "Vatican City", "Helsinki", "Tallinn", "Copenhagen", "Prague",
"Vienna", "Minsk", "Andorra La Vella", "Monaco", "Vilnius", "Podgorica", "Amsterdam", "Oslo", "Warsaw", "Lisbon", "Bucharest", "Belgrade", "San Marino", "Bratislava", "Prague", "Kiev"];

const searchInput = document.getElementById('search-input');
const searchField = document.querySelector('.search')
const searchResults = document.querySelector('.search-results');

// Adding an event listener to the search input that listens for keyup events
searchInput.addEventListener('keyup', () => {
  // Initializing an empty array to store search results
  let results = [];
  // Storing the current value of the search input
  let resultInput = searchInput.value;
  // If the search input has a value
  if (resultInput.length) {
    // Filtering the 'searchable' array for items that include the current search input value
    results = searchable.filter((item) => {
      return item.toLowerCase().includes(resultInput.toLowerCase())
    });
    //If there's no match, clearing the search results
    if(!results.length) {
      searchResults.classList.remove('search-show');
      searchResults.innerHTML = "";
      return;
    }
  } else {
    searchResults.classList.remove('search-show');
    searchResults.innerHTML = "";
    return;
  }

  renderResults(results);
})

//Function that renders the search results
function renderResults(results) {
  //If there's no results
  if(!results.length) {
    return searchResults.classList.remove('search-show');
  }

  //Mapping the filtered results to create the HTML for each result
  let searchContent = results.map((item) => {
    return `<li><a href="../../../assets/pages/today/today.html?city=${item}">${item}</a></li>`
  })
  //Joining the HTML of all results into a single string
  .join('');

  searchResults.classList.add('search-show')
  searchResults.innerHTML = `<ul>${searchContent}</ul>`;
}