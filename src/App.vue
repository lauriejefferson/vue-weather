<script setup>
import { ref } from 'vue';

const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
let city = ref("");
let weather = ref({});
let fetchedData = ref(false);
async function getWeather() {
  const error = ref(null)
  fetchedData.value = true;
  try {
   const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city.value}&appid=${apiKey}&units=imperial`)
   weather.value = await response.json()
   console.log(weather)
  }catch(e) {
    error.value = e
    console.log(error.value)
  }
}

</script>

<template>
 <form @submit.prevent="getWeather" class="form">
  <input type="text" placeholder="Enter city" v-model="city" >
  <button class="btn">Search</button>
 </form>
 <div v-if="fetchedData" class="weather-main">
  <h2>{{ weather.name }}</h2>
  <h1>{{ Math.round(weather.main.temp) }} &#8457</h1>
  <div v-for="(w, index) in weather.weather">
    <div key="index">
     <p>{{ w.description }}</p>
     <img :src="`https://openweathermap.org/img/wn/${w.icon}@2x.png`" alt="weather icon">
    </div>
  </div>
  <div class="weather-data">
   <ul>
      <li>
      <h3>High: </h3>
        <span>{{ Math.round(weather.main.temp_max) }} &#8457</span>
      </li>
      <li>
      <h3>Low: </h3>
        <span>{{Math.round(weather.main.temp_min) }} &#8457</span>
      </li>
    </ul>
    <ul>
      <li>
        <h3>Wind Speed: </h3>
        <span>{{ Math.round(weather.wind.speed) }}</span>
      </li>
      <li>
        <h3>Humidity: </h3>
        <span>{{ Math.round(weather.main.humidity) }} %</span>
      </li>
    </ul>
  </div>
 </div>
</template>

<style scoped>

.form {
  display: flex;
  justify-content: center;
  align-items: center;
}


.form input {
  border: 2px solid #5296A5;
  padding: 10px 30px;
  font-size: 1.125rem;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
}

.form input::placeholder {
  font-size: 1.10rem;
}

.btn {
  width: 150px;
  padding: 12px 25px;
  background-color: #5296A5;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  color: white;
  border: none;
  font-size: 1.125rem;
  cursor: pointer;
}

.weather-main {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 1em 0;
}

.weather-main h2 {
  text-align: center;
  text-transform: uppercase;
}

.weather-main p {
  text-align: center;
  text-transform: capitalize;
  margin-top: 1em;
  font-size: 1.125rem;
}
.weather-data {
  display: flex;
  justify-content: center;
  align-items: center;
}

.weather-data ul {
  display: flex;
  flex-direction: column;
  padding: 0;
}
 .weather-data li {
  display: flex;
  list-style-type: none;
  margin: 1.5em 1.2em;
 }

 .weather-data span {
  margin: 0.1em 0.5em 0;
 }
</style>
