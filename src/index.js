function formatDay(index) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  return days[index];
}

function formatMonth(index) {
  let months = [
    "Jan",
    "Fab",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
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
  return sentence;
}

function celsiusDegrees() {
  document.querySelector("#temp-c").style["font-size"] = "large";
  document.querySelector("#temp-c").style["font-weight"] = "bold";
  document.querySelector("#temp-f").style["font-size"] = "small";
  document.querySelector("#temp-f").style["font-weight"] = "normal";
}

function fahrenhateDegrees() {
  document.querySelector("#temp-f").style["font-size"] = "large";
  document.querySelector("#temp-f").style["font-weight"] = "bold";
  document.querySelector("#temp-c").style["font-size"] = "small";
  document.querySelector("#temp-c").style["font-weight"] = "normal";
}

function showWeather(response) {
  currentTemperatureC.max = Math.round(response.data.main.temp);
  currentTemperatureF.max = Math.round(currentTemperatureC.max * 1.8 + 32);

  document.querySelector("#current-city").innerHTML = response.data.name;
  document.querySelector("#cur-temp").innerHTML = currentTemperatureC.max;
  document.querySelector("#sky").innerHTML =
    response.data.weather[0].description;
  document.querySelector(
    "#humidity"
  ).innerHTML = `humidity - ${response.data.main.humidity}%`;
  document.querySelector(
    "#wind"
  ).innerHTML = `wind - ${response.data.wind.speed} m/s`;
  celsiusDegrees();
}

function setPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  
  let apiKey = "f7d5a287feccc9d05c7badbf5cac779d";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=${units}&appid=${apiKey}`;
  axios.get(apiUrl).then(showWeather);
}

function changeCity(event) {
  event.preventDefault();
  let newCity = document.querySelector("#new-city");
  let city = newCity.value.trim();
  if (city) {
    let apiKey = "309fab436235a57828d083b9954c5ccb";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    axios.get(apiUrl).then(showWeather);
  } else {
    alert("Enter a city!");
  }
  newCity.value = "";
}

function showTempF(event) {
  event.preventDefault();
  document.querySelector("#cur-temp").innerHTML = currentTemperatureF.max;
  fahrenhateDegrees();
}

function showTempC(event) {
  event.preventDefault();
  document.querySelector("#cur-temp").innerHTML = currentTemperatureC.max;
  celsiusDegrees();
}

// Current date

let datePlace = document.querySelector("#current-date");
datePlace.innerHTML = showDate();

// Search - change city

let searchButton = document.querySelector("#search-button");
searchButton.addEventListener("click", changeCity);

// °C - °F

let currentTemperatureC = {
  min: 15,
  max: 22
};

let currentTemperatureF = {
  min: Math.round(currentTemperatureC.min * 1.8 + 32),
  max: Math.round(currentTemperatureC.max * 1.8 + 32)
};

navigator.geolocation.getCurrentPosition(setPosition);

let tempF = document.querySelector("#temp-f");
tempF.addEventListener("click", showTempF);
let tempC = document.querySelector("#temp-c");
tempC.addEventListener("click", showTempC);

// Current button

let currentButton = document.querySelector("#current-button");
searchButton.addEventListener(
  "click",
  navigator.geolocation.getCurrentPosition(setPosition)
);