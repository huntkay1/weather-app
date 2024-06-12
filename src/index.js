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

window.addEventListener('load', () => {fetchData("South Haven Michigan");});


function updateUI(weatherData) {
    const locationData = weatherData.location;
    const forecastData = weatherData.forecast;
    const currentData = weatherData.current;

    locationName.innerHTML = locationData.name + ', ' + locationData.region;
    todaysHighTemp.innerHTML = forecastData.forecastday[0].day.maxtemp_f;
    todaysLowTemp.innerHTML = forecastData.forecastday[0].day.mintemp_f;
    currentTemp.innerHTML = currentData.temp_f;
    sunrise.innerHTML = forecastData.forecastday[0].astro.sunrise;
    sunset.innerHTML = forecastData.forecastday[0].astro.sunset;

    createHourlyForecastCards(forecastData);
}

function createHourlyForecastCards(forecastData) {
    const hourlyWeatherData = forecastData.forecastday[0].hour;
    
    hourlyWeatherData.forEach(hour => {
        const timeStamp = hour.time.split(' ')[1];
        const temp = hour.temp_f;
        const weatherCondition = hour.condition.text;

        const hourlyForecastContainer = document.getElementById('hourly-forecast-container')
        const hourlyCard = document.createElement('div');
        const hourlyCardTime = document.createElement('p');
        const hourlyCardIcon = document.createElement('div');
        const hourlyCardTemp = document.createElement('p');

        hourlyCard.classList.add('hour-card');
        hourlyCardTime.classList.add('card-time');
        hourlyCardTemp.classList.add('hour-card-temp');
        
        hourlyCardTime.innerHTML = timeStamp;
        hourlyCardIcon.innerHTML = '<svg width="50px" height="50px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" d="M512 704a192 192 0 1 0 0-384 192 192 0 0 0 0 384zm0 64a256 256 0 1 1 0-512 256 256 0 0 1 0 512zm0-704a32 32 0 0 1 32 32v64a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32zm0 768a32 32 0 0 1 32 32v64a32 32 0 1 1-64 0v-64a32 32 0 0 1 32-32zM195.2 195.2a32 32 0 0 1 45.248 0l45.248 45.248a32 32 0 1 1-45.248 45.248L195.2 240.448a32 32 0 0 1 0-45.248zm543.104 543.104a32 32 0 0 1 45.248 0l45.248 45.248a32 32 0 0 1-45.248 45.248l-45.248-45.248a32 32 0 0 1 0-45.248zM64 512a32 32 0 0 1 32-32h64a32 32 0 0 1 0 64H96a32 32 0 0 1-32-32zm768 0a32 32 0 0 1 32-32h64a32 32 0 1 1 0 64h-64a32 32 0 0 1-32-32zM195.2 828.8a32 32 0 0 1 0-45.248l45.248-45.248a32 32 0 0 1 45.248 45.248L240.448 828.8a32 32 0 0 1-45.248 0zm543.104-543.104a32 32 0 0 1 0-45.248l45.248-45.248a32 32 0 0 1 45.248 45.248l-45.248 45.248a32 32 0 0 1-45.248 0z"/></svg>';
        hourlyCardTemp.innerHTML = temp + '&#176';
    
    
        hourlyCard.appendChild(hourlyCardTime);
        hourlyCard.appendChild(hourlyCardIcon);
        hourlyCard.appendChild(hourlyCardTemp);
        hourlyForecastContainer.appendChild(hourlyCard);
    })

}




