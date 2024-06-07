import './style.css';

async function fetchData() {
    const response = await fetch('http://api.weatherapi.com/v1/forecast.json?key=9db405c9b16d42809f511752240606&q=Paris', {mode: 'cors'});
    const weatherData = await response.json();
    console.log(weatherData);
}

fetchData();

