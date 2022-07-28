//Variables:
var previousSearchEl = document.querySelector("#prevSearches")
var searchButton = document.querySelector("#searchButton")
var inputCity = document.querySelector('#inputCity')

//https://api.openweathermap.org/data/2.5/weather?q=denver&appid=30be9d6f81ee076d9023bf7273f7e725

//Functions:
//Grab the City out of the entry field and make the API call to grab weather data
function searchFormSubmit(){
    var inputCityText = inputCity.value.trim();
    console.log(inputCityText)

fetch("https://api.openweathermap.org/data/2.5/weather?q=" + inputCityText + "&appid=30be9d6f81ee076d9023bf7273f7e725", {
  // The browser fetches the resource from the remote server without first looking in the cache.
  // The browser will then update the cache with the downloaded resource.
  cache: 'reload',
})
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data);
  });
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