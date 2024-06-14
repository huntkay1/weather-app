import './style.css';
import { format, parseISO } from 'date-fns';

const locationInput = document.getElementById('location-input');
const submitBttn = document.getElementById('input-submit');
const locationName = document.getElementById('location');
const todaysHighTemp = document.getElementById('high-temp');
const todaysLowTemp = document.getElementById('low-temp');
const currentTemp = document.getElementById('current-temp');
const sunrise = document.getElementById('sunrise-time');
const sunset = document.getElementById('sunset-time');

const fahrenheitBttn = document.getElementById("fahren-button");
const celsiusBttn = document.getElementById('cels-button');
fahrenheitBttn.addEventListener('click', (e) => tempUnitToggle(e))
celsiusBttn.addEventListener('click', (e) => tempUnitToggle(e))

let currentTempUnit = 'F';

function tempUnitToggle(e) {
    const unitBttn = e.target;
    if (unitBttn.id === 'fahren-button') {
        fahrenheitBttn.classList.add('active');
        celsiusBttn.classList.remove('active');
        currentTempUnit = 'F';
    } else if (unitBttn.id === 'cels-button') {
        celsiusBttn.classList.add('active');
        fahrenheitBttn.classList.remove('active');
        currentTempUnit = 'C';
    };
    fetchData();
}


submitBttn.addEventListener('click', (e) => {
    const location = locationInput.value;
    e.preventDefault();
    fetchData(location);
});

async function fetchData(location = 'South Haven Michigan') {
    const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=9db405c9b16d42809f511752240606&q=${location}&days=7`, {mode: 'cors'});
    const weatherData = await response.json();
    updateUI(weatherData);
}

window.addEventListener('load', () => {fetchData("South Haven Michigan");});


function updateUI(weatherData) {
    updateCurrentDateAndTime();
    const locationData = weatherData.location;
    const forecastData = weatherData.forecast;
    const currentData = weatherData.current;

    const sunsetTime = forecastData.forecastday[0].astro.sunset;
    const sunriseTime = forecastData.forecastday[0].astro.sunrise;

    locationName.innerHTML = locationData.name;
    todaysHighTemp.innerHTML = currentTempUnit === 'F' ? Math.ceil(forecastData.forecastday[0].day.maxtemp_f) + '&#176' : Math.ceil(forecastData.forecastday[0].day.maxtemp_c) + '&#176';
    todaysLowTemp.innerHTML = currentTempUnit === 'F' ? Math.ceil(forecastData.forecastday[0].day.mintemp_f) + '&#176': Math.ceil(forecastData.forecastday[0].day.mintemp_c) + '&#176';
    currentTemp.innerHTML = currentTempUnit === 'F' ? Math.ceil(currentData.temp_f) : Math.ceil(currentData.temp_c);
    sunrise.innerHTML = sunriseTime;
    sunset.innerHTML = sunsetTime;

    createHourlyForecastCards(forecastData, sunriseTime, sunsetTime);
    createDailyForecastCards(forecastData);
}

function updateCurrentDateAndTime() {
    const headerDate = document.getElementById('header-date');
    const headerTime = document.getElementById('header-time');

    const currentDate = new Date().toLocaleDateString("en-US", {month: 'long', day: 'numeric'});
    const currentTime = new Date().toLocaleTimeString('en-US', {hour: "numeric", minute: "numeric"});

    headerDate.innerHTML = currentDate;
    headerTime.innerHTML = currentTime;
}

setInterval(updateCurrentDateAndTime, 10000); //updates current time every minute

function createHourlyForecastCards(forecastData, sunriseTime, sunsetTime) {
    const hourlyWeatherData = forecastData.forecastday[0].hour;
    const hourlyForecastContainer = document.getElementById('hourly-forecast-container')
    hourlyForecastContainer.innerHTML = '';
    console.log(hourlyWeatherData);
    
    hourlyWeatherData.forEach(hour => {
        const timeStamp = hour.time.split(' ')[1];
        const temp = currentTempUnit === 'F' ? Math.ceil(hour.temp_f) : Math.ceil(hour.temp_c);
        const weatherCondition = hour.condition.text;

        const hourlyCard = document.createElement('div');
        const hourlyCardTime = document.createElement('p');
        const hourlyCardIcon = document.createElement('div');
        const hourlyCardTemp = document.createElement('p');

        hourlyCard.classList.add('hour-card');
        hourlyCard.classList.add('card');
        hourlyCardTime.classList.add('card-time');
        hourlyCardTemp.classList.add('hour-card-temp');

        const formattedHour = formatHour(timeStamp);
        hourlyCardTime.innerHTML = formattedHour;
        hourlyCardIcon.innerHTML = getWeatherConditionIcon(weatherCondition, formattedHour, sunsetTime, sunriseTime);
        hourlyCardTemp.innerHTML = temp + '&#176';
    
    
        hourlyCard.appendChild(hourlyCardTime);
        hourlyCard.appendChild(hourlyCardIcon);
        hourlyCard.appendChild(hourlyCardTemp);
        hourlyForecastContainer.appendChild(hourlyCard);
    });
}

function createDailyForecastCards(forecastData) {

    const dailyForecastContainer = document.getElementById('daily-forecast-container');
    dailyForecastContainer.innerHTML = '';

    const weekdays = forecastData.forecastday;
    
    weekdays.forEach(weekday => {
        const fullDate = format(parseISO(weekday.date), 'E MMM dd');
        const dayOfWeek = fullDate.slice(0,3);
        const date = fullDate.slice(4);
        const highTemp = currentTempUnit === 'F' ? Math.ceil(weekday.day.maxtemp_f) : Math.ceil(weekday.day.maxtemp_c);
        const lowTemp = currentTempUnit === 'F' ? Math.ceil(weekday.day.mintemp_f) : Math.ceil(weekday.day.mintemp_c);
        const weatherCondition = weekday.day.condition.text;

        const dayCard = document.createElement('div');
        const dayCardIcon = document.createElement('div');
        const dayCardInfo = document.createElement('div');
        const cardDate = document.createElement('div');
        const dayOfWeekCont = document.createElement('h3');
        const dateCont = document.createElement('h4');
        const dayCardTemp = document.createElement('div');
        const highTempCont = document.createElement('h3');
        const lowTempCont = document.createElement('h3');

        dayCard.classList.add('day-card');
        dayCard.classList.add('card');
        dayCardInfo.classList.add('day-card-info');
        cardDate.classList.add('card-date');
        dayCardTemp.classList.add('day-card-temp');
        lowTempCont.classList.add('day-temp');
        highTempCont.classList.add('day-temp');

        highTempCont.innerHTML = `<span>High</span>${highTemp} &#176 `;
        lowTempCont.innerHTML = `<span>Low</span>${lowTemp} &#176 `;
        dayOfWeekCont.innerHTML = dayOfWeek;
        dateCont.innerHTML = date;
        dayCardIcon.innerHTML = getWeatherConditionIcon(weatherCondition);


        dayCardTemp.appendChild(highTempCont);
        dayCardTemp.appendChild(lowTempCont);
        cardDate.appendChild(dayOfWeekCont);
        cardDate.appendChild(dateCont);
        dayCard.appendChild(dayCardIcon);
        dayCardInfo.appendChild(cardDate);
        dayCardInfo.appendChild(dayCardTemp);
        dayCard.appendChild(dayCardInfo);
        dailyForecastContainer.appendChild(dayCard);

    })
}

function getWeatherConditionIcon(weatherCondition, formattedHour, sunsetTime, sunriseTime) {
    const sunIcon = '<svg width="50px" height="50px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="#e1ad01" d="M512 704a192 192 0 1 0 0-384 192 192 0 0 0 0 384zm0 64a256 256 0 1 1 0-512 256 256 0 0 1 0 512zm0-704a32 32 0 0 1 32 32v64a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32zm0 768a32 32 0 0 1 32 32v64a32 32 0 1 1-64 0v-64a32 32 0 0 1 32-32zM195.2 195.2a32 32 0 0 1 45.248 0l45.248 45.248a32 32 0 1 1-45.248 45.248L195.2 240.448a32 32 0 0 1 0-45.248zm543.104 543.104a32 32 0 0 1 45.248 0l45.248 45.248a32 32 0 0 1-45.248 45.248l-45.248-45.248a32 32 0 0 1 0-45.248zM64 512a32 32 0 0 1 32-32h64a32 32 0 0 1 0 64H96a32 32 0 0 1-32-32zm768 0a32 32 0 0 1 32-32h64a32 32 0 1 1 0 64h-64a32 32 0 0 1-32-32zM195.2 828.8a32 32 0 0 1 0-45.248l45.248-45.248a32 32 0 0 1 45.248 45.248L240.448 828.8a32 32 0 0 1-45.248 0zm543.104-543.104a32 32 0 0 1 0-45.248l45.248-45.248a32 32 0 0 1 45.248 45.248l-45.248 45.248a32 32 0 0 1-45.248 0z"/></svg>';
    const cloudIcon = '<svg width="50px" height="50px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="#333333" d="M737.216 357.952 704 349.824l-11.776-32a192.064 192.064 0 0 0-367.424 23.04l-8.96 39.04-39.04 8.96A192.064 192.064 0 0 0 320 768h368a207.808 207.808 0 0 0 207.808-208 208.32 208.32 0 0 0-158.592-202.048zm15.168-62.208A272.32 272.32 0 0 1 959.744 560a271.808 271.808 0 0 1-271.552 272H320a256 256 0 0 1-57.536-505.536 256.128 256.128 0 0 1 489.92-30.72z"/></svg>';
    const partlyCloudIcon = '<svg width="50px" height="50px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="#5579c6" d="M598.4 895.872H328.192a256 256 0 0 1-34.496-510.528A352 352 0 1 1 598.4 895.872zm-271.36-64h272.256a288 288 0 1 0-248.512-417.664L335.04 445.44l-34.816 3.584a192 192 0 0 0 26.88 382.848z"/><path fill="#e1ad01" d="M139.84 501.888a256 256 0 1 1 417.856-277.12c-17.728 2.176-38.208 8.448-61.504 18.816A192 192 0 1 0 189.12 460.48a6003.84 6003.84 0 0 0-49.28 41.408z"/></svg>';
    const rainIcon = '<svg width="50px" height="50px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="#5579c6" d="m739.328 291.328-35.2-6.592-12.8-33.408a192.064 192.064 0 0 0-365.952 23.232l-9.92 40.896-41.472 7.04a176.32 176.32 0 0 0-146.24 173.568c0 97.28 78.72 175.936 175.808 175.936h400a192 192 0 0 0 35.776-380.672zM959.552 480a256 256 0 0 1-256 256h-400A239.808 239.808 0 0 1 63.744 496.192a240.32 240.32 0 0 1 199.488-236.8 256.128 256.128 0 0 1 487.872-30.976A256.064 256.064 0 0 1 959.552 480zM224 800a32 32 0 0 1 32 32v96a32 32 0 1 1-64 0v-96a32 32 0 0 1 32-32zm192 0a32 32 0 0 1 32 32v96a32 32 0 1 1-64 0v-96a32 32 0 0 1 32-32zm192 0a32 32 0 0 1 32 32v96a32 32 0 1 1-64 0v-96a32 32 0 0 1 32-32zm192 0a32 32 0 0 1 32 32v96a32 32 0 1 1-64 0v-96a32 32 0 0 1 32-32z"/></svg>';
    const stormIcon = '<svg width="50px" height="50px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="#333333" d="M288 671.36v64.128A239.808 239.808 0 0 1 63.744 496.192a240.32 240.32 0 0 1 199.488-236.8 256.128 256.128 0 0 1 487.872-30.976A256.064 256.064 0 0 1 736 734.016v-64.768a192 192 0 0 0 3.328-377.92l-35.2-6.592-12.8-33.408a192.064 192.064 0 0 0-365.952 23.232l-9.92 40.896-41.472 7.04a176.32 176.32 0 0 0-146.24 173.568c0 91.968 70.464 167.36 160.256 175.232z"/><path fill="#000000" d="M416 736a32 32 0 0 1-27.776-47.872l128-224a32 32 0 1 1 55.552 31.744L471.168 672H608a32 32 0 0 1 27.776 47.872l-128 224a32 32 0 1 1-55.68-31.744L552.96 736H416z"/></svg>';
    const nightIcon = '<svg width="50px" height="50px" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="#333333" d="M240.448 240.448a384 384 0 1 0 559.424 525.696 448 448 0 0 1-542.016-542.08 390.592 390.592 0 0 0-17.408 16.384zm181.056 362.048a384 384 0 0 0 525.632 16.384A448 448 0 1 1 405.056 76.8a384 384 0 0 0 16.448 525.696z"/></svg>';

    if (weatherCondition === 'Sunny' || weatherCondition === 'Clear ' || weatherCondition === 'Clear') {
        return sunIcon;
    } else if (weatherCondition === 'Partly Cloudy ' || weatherCondition === 'Patchy rain nearby') {
        return partlyCloudIcon;
    } else if ( weatherCondition === 'Moderate rain' || weatherCondition === 'Patchy light drizzle' || weatherCondition === 'Light rain shower' || weatherCondition === 'Mist' || weatherCondition === 'Light rain' || weatherCondition === 'Moderate rain at times') {
        return rainIcon;
    } else if (weatherCondition === 'Overcast') {
        return cloudIcon;
    };
}

//reformats from military time
function formatHour(hour) {
    hour = hour.slice(0,2); //get first two digits 
    if (hour === '00') {
        hour = '12'
    }
    if (hour[0] === "0") {
        hour = hour.substring(1); //gets rid of 0 at the front
    }

    const amOrPm = hour < 13 ? "AM" : "PM"; //since the hours end at 11PM
	let hourNumber = hour < 12 ? hour : hour - 12;
	hourNumber === 0 ? (hourNumber = 12) : null;
	return `${hourNumber} ${amOrPm}`;
}




