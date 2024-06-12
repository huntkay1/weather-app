import './style.css';

const locationInput = document.getElementById('location-input');
const submitBttn = document.getElementById('input-submit');
const locationName = document.getElementById('location');
const todaysHighTemp = document.getElementById('high-temp');
const todaysLowTemp = document.getElementById('low-temp');
const currentTemp = document.getElementById('current-temp');
const sunrise = document.getElementById('sunrise-time');
const sunset = document.getElementById('sunset-time');

submitBttn.addEventListener('click', (e) => {
    const location = locationInput.value;
    e.preventDefault();
    fetchData(location);
});

async function fetchData(location) {
    const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=9db405c9b16d42809f511752240606&q=${location}&days=7`, {mode: 'cors'});
    const weatherData = await response.json();
    updateUI(weatherData);
    console.log(weatherData);

    return weatherData
}

window.addEventListener('load', () => {fetchData("South Haven");});


function updateUI(weatherData) {
    const locationData = weatherData.location;
    const forecastData = weatherData.forecast;
    const currentData = weatherData.current;

    locationName.innerHTML = locationData.name;
    todaysHighTemp.innerHTML = forecastData.forecastday[0].day.maxtemp_f;
    todaysLowTemp.innerHTML = forecastData.forecastday[0].day.mintemp_f;
    currentTemp.innerHTML = currentData.temp_f;
    sunrise.innerHTML = forecastData.forecastday[0].astro.sunrise;
    sunset.innerHTML = forecastData.forecastday[0].astro.sunset;

}





