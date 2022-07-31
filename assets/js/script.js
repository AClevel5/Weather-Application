//Variables:
var previousSearchEl = document.querySelector("#prevSearches");
var searchButton = document.querySelector("#searchButton");
var inputCity = document.querySelector('#inputCity');
var latitude = [];
var longitude = [];
var apiKey = "30be9d6f81ee076d9023bf7273f7e725";
var exclude = "hourly,minutely,alerts";
var cityName = document.querySelector("#cityName");
var temp = document.querySelector("#temp");
var wind = document.querySelector("#wind");
var humidity = document.querySelector("#humidity")
var uvIndex = document.querySelector("#uvIndex");
//https://api.openweathermap.org/data/2.5/weather?q=denver&appid=30be9d6f81ee076d9023bf7273f7e725

//Functions:
//Grab the City out of the entry field and make the API call to grab weather data
function searchFormSubmit(){
    var inputCityText = inputCity.value.trim();
    console.log(inputCityText)

  if (inputCityText != "")

fetch("https://api.openweathermap.org/data/2.5/weather?q=" + inputCityText + "&units=metric&appid=" + apiKey, {
  // The browser fetches the resource from the remote server without first looking in the cache.
  // The browser will then update the cache with the downloaded resource.
  cache: 'reload',
})
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    //console.log(data);
    cityName.innerHTML = data.name;
    temp.innerHTML = data.main.temp;
    wind.innerHTML = data.wind.speed;
    humidity.innerHTML = data.main.humidity;
   // uvIndex.innerHTML = data.
    latitude = data.coord.lat;
    longitude = data.coord.lon;
    // console.log(latitude);
    // console.log(longitude);
    grabWeatherInfo(latitude, longitude)
  });
  else
  alert("Please enter a valid city")
}

function grabWeatherInfo(lat, lon) {
  fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=" + exclude + "&appid=" + apiKey)
  .then(function (response) {
    return response.json();
  })
  .then(function (data){
  //console.log(data);
  uvIndex.innerHTML = data.daily[0].uvi;
  let filteredArray = data.daily.slice(1, 6);
  console.log(filteredArray)
  populateForcastDetails(filteredArray)
  })
};

function populateForcastDetails (filteredArray){
  let forcastDiv = document.querySelector("#forcast");
  for (let i = 0; i < filteredArray.length; i++) {
    let parentDiv = document.createElement("div")
    parentDiv.setAttribute("class","card custom-card col-12 col-lg-2");
   let dateDiv = document.createElement("p");
   let humidityDiv = document.createElement("p");
   let tempDiv = document.createElement("p");
   let windDiv = document.createElement("p");
   let formattedDate = new Date(filteredArray[i].dt*1000).toISOString().split("T")[0];
   
   dateDiv.innerHTML = formattedDate;
   humidityDiv.innerHTML = "Humidity: " + filteredArray[i].humidity; + "%";
   tempDiv.innerHTML = "Temperature: " + filteredArray[i].temp.day + "°";
   windDiv.innerHTML = "Wind Speed: " + filteredArray[i].wind_speed + " MPH";

   parentDiv.append(dateDiv, humidityDiv, tempDiv, windDiv);
   forcastDiv.append(parentDiv);

    
  }
  
}

//Pass City into Open Weather API to grab response. Only want Current and Daily info back so need logic to cut out hourly, alerts, & minutely
//Current update: Grab City (date), Temp, Wind, Humidity, UV index and update into state div
//Daily update: Grab Date, icon, temp, wind, humidty and create a card per day to store the data
//Store last city searched into local storage
//create list of cities from local storage

//Call Functions:


//Event Listeners:
// Grab input of input box once search is clicked
searchButton.addEventListener("click",() => searchFormSubmit());