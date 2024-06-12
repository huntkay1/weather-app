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
    console.log(hourlyWeatherData);
    
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
        
        const weatherIcon = getWeatherConditionIcon(weatherCondition);

        hourlyCardTime.innerHTML = timeStamp;
        hourlyCardIcon.innerHTML = weatherIcon;
        hourlyCardTemp.innerHTML = temp + '&#176';
    
    
        hourlyCard.appendChild(hourlyCardTime);
        hourlyCard.appendChild(hourlyCardIcon);
        hourlyCard.appendChild(hourlyCardTemp);
        hourlyForecastContainer.appendChild(hourlyCard);
    })

}

function getWeatherConditionIcon(weatherCondition) {
console.log(weatherCondition)
    const sunIcon = '<svg width="50px" height="50px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" d="M512 704a192 192 0 1 0 0-384 192 192 0 0 0 0 384zm0 64a256 256 0 1 1 0-512 256 256 0 0 1 0 512zm0-704a32 32 0 0 1 32 32v64a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32zm0 768a32 32 0 0 1 32 32v64a32 32 0 1 1-64 0v-64a32 32 0 0 1 32-32zM195.2 195.2a32 32 0 0 1 45.248 0l45.248 45.248a32 32 0 1 1-45.248 45.248L195.2 240.448a32 32 0 0 1 0-45.248zm543.104 543.104a32 32 0 0 1 45.248 0l45.248 45.248a32 32 0 0 1-45.248 45.248l-45.248-45.248a32 32 0 0 1 0-45.248zM64 512a32 32 0 0 1 32-32h64a32 32 0 0 1 0 64H96a32 32 0 0 1-32-32zm768 0a32 32 0 0 1 32-32h64a32 32 0 1 1 0 64h-64a32 32 0 0 1-32-32zM195.2 828.8a32 32 0 0 1 0-45.248l45.248-45.248a32 32 0 0 1 45.248 45.248L240.448 828.8a32 32 0 0 1-45.248 0zm543.104-543.104a32 32 0 0 1 0-45.248l45.248-45.248a32 32 0 0 1 45.248 45.248l-45.248 45.248a32 32 0 0 1-45.248 0z"/></svg>';
    const cloudIcon = '<svg width="50px" height="50px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" d="M737.216 357.952 704 349.824l-11.776-32a192.064 192.064 0 0 0-367.424 23.04l-8.96 39.04-39.04 8.96A192.064 192.064 0 0 0 320 768h368a207.808 207.808 0 0 0 207.808-208 208.32 208.32 0 0 0-158.592-202.048zm15.168-62.208A272.32 272.32 0 0 1 959.744 560a271.808 271.808 0 0 1-271.552 272H320a256 256 0 0 1-57.536-505.536 256.128 256.128 0 0 1 489.92-30.72z"/></svg>';
    const partlyCloudIcon = '<svg width="50px" height="50px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" d="M598.4 895.872H328.192a256 256 0 0 1-34.496-510.528A352 352 0 1 1 598.4 895.872zm-271.36-64h272.256a288 288 0 1 0-248.512-417.664L335.04 445.44l-34.816 3.584a192 192 0 0 0 26.88 382.848z"/><path fill="#000000" d="M139.84 501.888a256 256 0 1 1 417.856-277.12c-17.728 2.176-38.208 8.448-61.504 18.816A192 192 0 1 0 189.12 460.48a6003.84 6003.84 0 0 0-49.28 41.408z"/></svg>';
    const rainIcon = '<svg width="50px" height="50px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" d="m739.328 291.328-35.2-6.592-12.8-33.408a192.064 192.064 0 0 0-365.952 23.232l-9.92 40.896-41.472 7.04a176.32 176.32 0 0 0-146.24 173.568c0 97.28 78.72 175.936 175.808 175.936h400a192 192 0 0 0 35.776-380.672zM959.552 480a256 256 0 0 1-256 256h-400A239.808 239.808 0 0 1 63.744 496.192a240.32 240.32 0 0 1 199.488-236.8 256.128 256.128 0 0 1 487.872-30.976A256.064 256.064 0 0 1 959.552 480zM224 800a32 32 0 0 1 32 32v96a32 32 0 1 1-64 0v-96a32 32 0 0 1 32-32zm192 0a32 32 0 0 1 32 32v96a32 32 0 1 1-64 0v-96a32 32 0 0 1 32-32zm192 0a32 32 0 0 1 32 32v96a32 32 0 1 1-64 0v-96a32 32 0 0 1 32-32zm192 0a32 32 0 0 1 32 32v96a32 32 0 1 1-64 0v-96a32 32 0 0 1 32-32z"/></svg>';
    const stormIcon = '<svg width="50px" height="50px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="#000000" d="M288 671.36v64.128A239.808 239.808 0 0 1 63.744 496.192a240.32 240.32 0 0 1 199.488-236.8 256.128 256.128 0 0 1 487.872-30.976A256.064 256.064 0 0 1 736 734.016v-64.768a192 192 0 0 0 3.328-377.92l-35.2-6.592-12.8-33.408a192.064 192.064 0 0 0-365.952 23.232l-9.92 40.896-41.472 7.04a176.32 176.32 0 0 0-146.24 173.568c0 91.968 70.464 167.36 160.256 175.232z"/><path fill="#000000" d="M416 736a32 32 0 0 1-27.776-47.872l128-224a32 32 0 1 1 55.552 31.744L471.168 672H608a32 32 0 0 1 27.776 47.872l-128 224a32 32 0 1 1-55.68-31.744L552.96 736H416z"/></svg>';

    if (weatherCondition === 'Sunny' || weatherCondition === 'Clear ') {
        return sunIcon;
    } else if (weatherCondition === 'Partly Cloudy ') {
        return partlyCloudIcon;
    } else if (weatherCondition === 'Patchy rain nearby') {
        return rainIcon;
    }
}




