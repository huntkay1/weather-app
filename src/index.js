import './style.css';

const locationInput = document.getElementById('location');
const submitBttn = document.querySelector('button');

submitBttn.addEventListener('click', (e) => {fetchData(e)});

async function fetchData(e) {
    e.preventDefault();
    const location = locationInput.value;
    const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=9db405c9b16d42809f511752240606&q=${location}&days=7`, {mode: 'cors'});
    const weatherData = await response.json();
    console.log(weatherData.forecast);
}

fetchData();

