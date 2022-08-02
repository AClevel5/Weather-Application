//Variables:
var previousSearchEl = document.querySelector("#prevSearches");
var searchButton = document.querySelector("#searchButton");
var inputCity = document.querySelector('#inputCity');
var iconImg = document.querySelector("#iconImg");
var latitude = [];
var longitude = [];
var apiKey = "30be9d6f81ee076d9023bf7273f7e725";
var exclude = "hourly,minutely,alerts";
var cityName = document.querySelector("#cityName");
var temp = document.querySelector("#temp");
var wind = document.querySelector("#wind");
var humidity = document.querySelector("#humidity")
var uvIndex = document.querySelector("#uvIndex");
var searchHistory = [];
var iconUrl = "https://openweathermap.org/img/w/";
//https://api.openweathermap.org/data/2.5/weather?q=denver&appid=30be9d6f81ee076d9023bf7273f7e725

//Functions:
//Grab the City out of the entry field and make the API call to grab weather data
function searchFormSubmit(inputCityText) {
  
  addSearchHistory(inputCityText)
  storeSearchHistory();
  inputCity.value = "";

  if (inputCityText != "")

    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + inputCityText + "&units=imperial&appid=" + apiKey, {
      // The browser fetches the resource from the remote server without first looking in the cache.
      // The browser will then update the cache with the downloaded resource.
      cache: 'reload',
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
        iconImg.innerHTML = "";
        let iconDisplay = iconUrl + data.weather[0].icon + ".png";
        var image = new Image();
        image.src = iconDisplay;
        iconImg.appendChild(image);
        cityName.innerHTML = data.name;
        temp.innerHTML = data.main.temp + "°";
        wind.innerHTML = data.wind.speed + " MPH";
        humidity.innerHTML =  data.main.humidity + "%";
        latitude = data.coord.lat;
        longitude = data.coord.lon;
        grabWeatherInfo(latitude, longitude)
      });
  else
    alert("Please enter a valid city")
}

//using lat and long from the other AP enter it into one call to grab desired data
function grabWeatherInfo(lat, lon) {
  fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=" + exclude + "&units=imperial&appid=" + apiKey)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      uvIndex.innerHTML = data.daily[0].uvi;
      let filteredArray = data.daily.slice(1, 6);
      populateForcastDetails(filteredArray)
      if (data.daily[0].uvi <= 2) {
        uvIndex.setAttribute("class","low");
      }
      else if (data.daily[0].uvi > 2 && data.daily[0].uvi <= 6) {
        uvIndex.setAttribute("class","medium");
      }
      else (uvIndex > 6)
        uvIndex.setAttribute("class","high");
      
    })
};

//populate cards info for the 5 day forcast
function populateForcastDetails(filteredArray) {
  let forcastDiv = document.querySelector("#forcast");
  forcastDiv.innerHTML = "";
  for (let i = 0; i < filteredArray.length; i++) {
    let parentDiv = document.createElement("div")
    parentDiv.setAttribute("class", "card custom-card col-12 col-lg-2");
    let dateDiv = document.createElement("p");
    let humidityDiv = document.createElement("p");
    let tempDiv = document.createElement("p");
    let windDiv = document.createElement("p");
    let formattedDate = new Date(filteredArray[i].dt * 1000).toISOString().split("T")[0];

    dateDiv.innerHTML = formattedDate;
    humidityDiv.innerHTML = "Humidity: " + filteredArray[i].humidity + "%";
    tempDiv.innerHTML = "Temperature: " + filteredArray[i].temp.day + "°";
    windDiv.innerHTML = "Wind Speed: " + filteredArray[i].wind_speed + " MPH";

    parentDiv.append(dateDiv, humidityDiv, tempDiv, windDiv);
    forcastDiv.append(parentDiv);

  }
  createPrevSearchList()
};

// add search to an array
function addSearchHistory(input) {
  if (!searchHistory.includes(input.toUpperCase())){
  searchHistory.push(input.toUpperCase());
  
}};

//push that array to local storage
function storeSearchHistory() {
  localStorage.setItem("City", JSON.stringify(searchHistory));
}

//create list of cities from local storage
function createPrevSearchList() {
  previousSearchEl.innerHTML = "";
  let currentList = JSON.parse(localStorage.getItem("City"));
  for (let i = 0; i < currentList.length; i++) {
    let listItem = document.createElement("li");
    let newButton = document.createElement("button")
    newButton.innerHTML = currentList[i];
    newButton.addEventListener("click", function(event){
      console.log(event.target.innerHTML)
      let targetCity = event.target.innerHTML;
      searchFormSubmit(targetCity);
    })
    listItem.append(newButton);
    previousSearchEl.append(listItem);
  }
};

// Add Icons to cards and main
// Fix bugs on cards and previous search items
// click on previous search and pulls again


//Event Listeners:
// Grab input of input box once search is clicked
searchButton.addEventListener("click", () => {
  var inputCityText = inputCity.value.trim();
  searchFormSubmit(inputCityText)
} );