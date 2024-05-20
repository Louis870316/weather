const express = require('express');
const exphbs = require('express-handlebars');
const axios = require('axios');
require('dotenv').config();

const app = express();

// 設定 Handlebars 視圖引擎
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))

// 設定 OpenWeather API 的基本 URL 和 API 金鑰
const baseURL = 'https://api.openweathermap.org/data/2.5/weather';
const apiKey = process.env.API_KEY;

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/weather', async (req, res) => {
  const city = req.query.city;
  console.log(city);

  try {
    const response = await axios.get(baseURL, {
      params: {
        q: city,
        appid: apiKey,
        units: 'metric'
      }
    });

    const weatherData = response.data;

    res.render('city', {
      city: weatherData.name,
      description: weatherData.weather[0].description,
      temperature: weatherData.main.temp,
      humidity: weatherData.main.humidity,
      windSpeed: weatherData.wind.speed,
      clouds: weatherData.clouds.all
    });
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    res.render('error', { message: 'Error fetching weather data. Please try again.' });
  }
});

app.listen(3000, () => {
  console.log('Running on http://localhost:3000');
});