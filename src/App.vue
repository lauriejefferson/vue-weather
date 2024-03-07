<script setup>
import { ref } from 'vue';

const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
let result = ref("");
let city = ref("");
let state = ref("");
let country = ref("");
let weather = ref({});
let fetchedData = ref(false);

async function getWeather() {
  const error = ref(null)
  fetchedData.value = true;
  try {
    city.value = result.value.split(',')[0]
    state.value = result.value.split(',')[1]
    country.value = result.value.split(',')[2]
    const geoJSON = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city.value},${state.value},${country.value}&limit=1&appid=${apiKey}`)
    const geoData = await geoJSON.json()
    console.log(geoData)
    // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city.value}&appid=${apiKey}&units=imperial`)
    // weather.value = await response.json()
    // console.log(weather)
  } catch (e) {
    error.value = e
    console.log(error.value)
  }
}

const labels = ref({ 0: 'SU', 1: 'MO', 2: 'TU', 3: 'WED', 4: 'TH', 5: 'FR', 6: 'SA' });
const expand = ref(false);
const time = ref(0);
const forecast = ref([{ day: 'Tuesday', icon: 'mdi-white-balance-sunny', temp: '24\xB0/12\xB0' },
{ day: 'Wednesday', icon: 'mdi-white-balance-sunny', temp: '22\xB0/14\xB0' },
{ day: 'Thursday', icon: 'mdi-cloud', temp: '25\xB0/15\xB0' },]);

</script>

<template>
  <form @submit.prevent="getWeather" class="form">
    <input type="text" placeholder="Enter city, state, country " v-model="result">
    <button class="btn">Search</button>
  </form>
  <!-- <div v-if="fetchedData" class="weather-main">
    <h1>{{ weather.name }}</h1>
    <h2>{{ Math.round(weather.main.temp) }} &#8457</h2>
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
          <span>{{ Math.round(weather.main.temp_min) }} &#8457</span>
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
  </div> -->

  <v-card class="mx-auto mt-3" max-width="400" v-if="fetchedData" v-for="(w, index) in weather.weather" :key="index">
    <v-card-item :title="weather.name">
      <template v-slot:subtitle>
        {{ w.description }}
        <v-img :src="`https://openweathermap.org/img/wn/${w.icon}@2x.png`" :width="100"></v-img>
      </template>
    </v-card-item>
    <v-card-text class="py-0">
      <v-row align="center" no-gutters>
        <v-col class="text-h2" cols="6">
          {{ Math.round(weather.main.temp) }}&deg;F
        </v-col>
        <!-- <v-col class="text-right" cols="4">
          <v-img :src="`https://openweathermap.org/img/wn/${w.icon}@2x.png`" :width="100"></v-img>
        </v-col> -->
      </v-row>
    </v-card-text>

    <div class=" d-flex py-3 justify-space-between">
      <v-list-item>
        <template v-slot:prepend>
          <v-icon icon="mdi-weather-windy"></v-icon>
        </template>
        <v-list-item-subtitle>{{ weather.wind.speed }} km/h</v-list-item-subtitle>
      </v-list-item>

      <v-list-item prepend-icon="mdi-weather-pouring">
        <v-list-item-subtitle>{{ weather.clouds.all }}%</v-list-item-subtitle>
      </v-list-item>
    </div>

    <v-expand-transition>
      <div v-if="expand">
        <div class="py-2">
          <v-slider v-model="time" :max="6" :step="1" :ticks="labels" class="mx-4" color="primary" density="compact"
            show-ticks="always" thumb-size="10" hide-details></v-slider>
        </div>

        <v-list class="bg-transparent">
          <v-list-item v-for="item in forecast" :key="item.day" :append-icon="item.icon" :subtitle="item.temp"
            :title="item.day">
          </v-list-item>
        </v-list>
      </div>
    </v-expand-transition>

    <v-divider></v-divider>

    <v-card-actions>
      <v-btn @click="expand = !expand">
        {{ !expand ? 'Full Report' : 'Hide Report' }}
      </v-btn>
    </v-card-actions>
  </v-card>

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
  font-size: 1.125rem;
}

.weather-data span {
  margin: 0.25em 0.5em 0;

}
</style>
