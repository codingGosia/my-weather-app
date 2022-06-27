function formatDay(index) {     
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[index];
}

function formatForecastDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
}

function formatMonth(index) {
  let months = ["Jan", "Fab", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months[index];
}

function formatTime(time) {
  if (time < 10) {
    time = "0" + time;
  }
  return time;
}

function showDate() {
  let now = new Date();
  let currentDay = formatDay(now.getDay());
  let currentDate = now.getDate();
  let currentMonth = formatMonth(now.getMonth());
  let currentYear = now.getFullYear();
  let currentHours = formatTime(now.getHours());
  let currentMinutes = formatTime(now.getMinutes());

  let sentence = `${currentDay} ${currentHours}:${currentMinutes}, ${currentDate} ${currentMonth} ${currentYear}`;
  document.querySelector("#current-date").innerHTML = sentence;
}

function activateCelsiusDegrees() {
  document.querySelector("#temp-c").style["font-size"] = "large";
  document.querySelector("#temp-c").style["font-weight"] = "bold";
  document.querySelector("#temp-f").style["font-size"] = "small";
  document.querySelector("#temp-f").style["font-weight"] = "normal";
}

function activateFahrenheitDegrees() {
  document.querySelector("#temp-f").style["font-size"] = "large";
  document.querySelector("#temp-f").style["font-weight"] = "bold";
  document.querySelector("#temp-c").style["font-size"] = "small";
  document.querySelector("#temp-c").style["font-weight"] = "normal";
}

function showForecast(response) {
  let forecast = response.data.daily;
  let forecastHTML = `<div class="row">`;
  forecast.forEach(function(day, index) {
    if (index < countForecastDays) {
      forecastHTML += `
        <div class="col p-0">
          <h6>${formatForecastDay(day.dt)}</h6>
          <div class="week-icon">${getIcon(day.weather[0].main)}</div>
          <div id="day-${index}-min-temp">${Math.round(day.temp.min)}°</div>
          <div id="day-${index}-max-temp">${Math.round(day.temp.max)}°</div>
        </div>`;
      weekTemperature.celsiusMin[index] = Math.round(day.temp.min);
      weekTemperature.celsiusMax[index] = Math.round(day.temp.max); 
      weekTemperature.fahrenheitMin[index] = Math.round(weekTemperature.celsiusMin[index] * 1.8 + 32);
      weekTemperature.fahrenheitMax[index] = Math.round(weekTemperature.celsiusMax[index] * 1.8 + 32);
    }
  })

  document.querySelector("#forecast").innerHTML = forecastHTML;
}

function getForecast (latitude, longitude) {
  let forecastApiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=${units}&exclude=hourly,minutely&appid=${apiKey}`;
  axios.get(forecastApiUrl).then(showForecast);
}

function showWeather(response) {
  currentTemperature.celsius = Math.round(response.data.main.temp);
  currentTemperature.fahrenheit = Math.round(currentTemperature.celsius * 1.8 + 32);

  document.querySelector("#current-city").innerHTML = response.data.name;
  document.querySelector("#current-temperature").innerHTML = currentTemperature.celsius;
  document.querySelector("#weather-description").innerHTML = response.data.weather[0].description;
  document.querySelector("#humidity").innerHTML = `humidity - ${response.data.main.humidity}%`;
  document.querySelector("#wind").innerHTML = `wind - ${response.data.wind.speed} m/s`;
  document.querySelector("#current-icon").innerHTML = getIcon(response.data.weather[0].main);
  
  activateCelsiusDegrees();
  showDate();

  getForecast(response.data.coord.lat, response.data.coord.lon);
}

function createPositionApiUrl(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${units}&appid=${apiKey}`;
  getWeather(apiUrl);
}

function getWeather(apiUrl) {
    axios.get(apiUrl).then(showWeather);
}

function weatherByPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(createPositionApiUrl);
}

function weatherByCity(event) {
  event.preventDefault();
  let newCity = document.querySelector("#new-city");
  let city = newCity.value.trim();
  if (city) {
    let currentApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`;
    getWeather(currentApiUrl);
  } else {
    alert("Enter a city!");
  }
  newCity.value = "";
  showDate();
}

function showTempF(event) {
  event.preventDefault();
  document.querySelector("#current-temperature").innerHTML = currentTemperature.fahrenheit;
  for (var i = 0; i < countForecastDays; i++) {
    document.querySelector(`#day-${i}-min-temp`).innerHTML = `${weekTemperature.fahrenheitMin[i]}°`;
    document.querySelector(`#day-${i}-max-temp`).innerHTML = `${weekTemperature.fahrenheitMax[i]}°`;
  }
  activateFahrenheitDegrees();
}

function showTempC(event) {
  event.preventDefault();
  document.querySelector("#current-temperature").innerHTML = currentTemperature.celsius;
   for (var i = 0; i < countForecastDays; i++) {
    document.querySelector(`#day-${i}-min-temp`).innerHTML = `${weekTemperature.celsiusMin[i]}°`;
    document.querySelector(`#day-${i}-max-temp`).innerHTML = `${weekTemperature.celsiusMax[i]}°`;
  }
  activateCelsiusDegrees();
}

function getIcon(weatherDescription) {
    let weatherIcons = {
        Drizzle: '<i class="fa-solid fa-cloud-rain"></i>',
        Rain: '<i class="fa-solid fa-cloud-showers-heavy"></i>',
        Snow: '<i class="fa-solid fa-snowflake"></i>',
        Clear: '<i class="fa-solid fa-sun"></i>',
        Clouds: '<i class="fa-solid fa-cloud-sun"></i>',

        Smoke: '<i class="fa-solid fa-smog"></i>',
        Haze: '<i class="fa-solid fa-smog"></i>',
        Dust: '<i class="fa-solid fa-smog"></i>',
        Fog: '<i class="fa-solid fa-smog"></i>',
        Sand: '<i class="fa-solid fa-smog"></i>',
        Ash: '<i class="fa-solid fa-smog"></i>',

        Squall: '<i class="fa-solid fa-wind"></i>',
        Tornado: '<i class="fa-solid fa-tornado"></i>'   
    }
    if (weatherDescription in weatherIcons) {
        return weatherIcons[weatherDescription];
    }
    else return "";
}

let currentTemperature = {
  celsius: 0,
  fahrenheit: 0
};

let weekTemperature = {
  celsiusMin: [0, 0, 0, 0, 0],
  celsiusMax: [0, 0, 0, 0, 0],
  fahrenheitMin: [0, 0, 0, 0, 0],
  fahrenheitMax: [0, 0, 0, 0, 0],
}

let apiKey = "f7d5a287feccc9d05c7badbf5cac779d";
let defaultCity = "New York";
let units = "metric";
let countForecastDays = 5;
let defaultApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${defaultCity}&units=${units}&appid=${apiKey}`;

showDate();
getWeather(defaultApiUrl);

document.querySelector("#search-button").addEventListener("click", weatherByCity);
document.querySelector("#current-button").addEventListener("click", weatherByPosition);

document.querySelector("#temp-f").addEventListener("click", showTempF);
document.querySelector("#temp-c").addEventListener("click", showTempC);