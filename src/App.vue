<script setup>
import { ref, computed } from 'vue';

const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
const cityRef = ref("");
const result = ref("");
const weather = ref([{}]);
const fetchedData = ref(false);

async function getWeather() {
  const error = ref(null)
  fetchedData.value = true;
  try {
    const city = result.value
    const geoJSON = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`)
    const geoData = await geoJSON.json()
    const lat = geoData[0].lat
    const lon = geoData[0].lon
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`)
    const data = await response.json()
    cityRef.value = data.city;
    weather.value = data.list.filter(item => item.dt_txt.substring(10).indexOf("12:00:00") > -1)
    console.log(cityRef.value)
    console.log(weather.value)

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
const currentDay = computed(() => weather.value[0]);
const weekDays = computed(() => weather.value.slice(1, 5))
</script>

<template>
  <form @submit.prevent="getWeather" class="form">
    <input type="text" placeholder="Enter a city " v-model="result">
    <button class="btn">Search</button>
  </form>

  <v-card class="mx-auto mt-3" max-width="400" v-if="fetchedData">
    <v-card-item :title="cityRef.name" v-for="(item, i) in currentDay.weather" :key="i">
      <template v-slot:subtitle>
        {{ item.description }}
        <v-img :src="`https://openweathermap.org/img/wn/${item.icon}@2x.png`" :width="100"></v-img>
      </template>
    </v-card-item>
    <v-card-text class="py-0">
      <v-row align="center" no-gutters v-if="currentDay.main">
        <v-col class="text-h2" cols="6">
          {{ Math.round(currentDay.main.temp) }}&deg;F
        </v-col>
      </v-row>
    </v-card-text>

    <div class=" d-flex  justify-space-between mr-2 py-3">
      <v-list-item v-if="currentDay.wind">
        <template v-slot:prepend>
          <v-icon icon=" mdi-weather-windy" class="mr-n5"></v-icon>
        </template>
        <v-list-item-subtitle>{{ currentDay.wind.speed }} km/h</v-list-item-subtitle>
      </v-list-item>

      <v-list-item v-if="currentDay.clouds">
        <template v-slot:prepend>
          <v-icon icon="mdi-weather-pouring" class="mr-n5"></v-icon>
        </template>
        <v-list-item-subtitle>{{ currentDay.clouds.all }}%</v-list-item-subtitle>
      </v-list-item>
    </div>

    <v-expand-transition>
      <div v-if="expand">
        <div class="py-2">
          <v-slider v-model="time" :max="6" :step="1" :ticks="labels" class="mx-4" color="primary" density="compact"
            show-ticks="always" thumb-size="10" hide-details></v-slider>
        </div>

        <v-list class="bg-transparent">
          <v-list-item v-for="(item, i) in  weekDays" :key="i" append-icon="item.weather.icon"
            :subtitle="item.main.temp" :title="item.dt_txt.substring(0, 10)">
            <template v-slot:append>
              <div v-for="(val, k) in item.weather" :key="k">
                <v-img :src="`https://openweathermap.org/img/wn/${val.icon}@2x.png`" :width="100"></v-img>
              </div>

            </template>
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
  padding: 0.6em 1em;
  font-size: 1.125rem;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
}

.form input::placeholder {
  font-size: 1.10rem;
}

.btn {
  width: 100%;
  padding: 1em;
  background-color: #5296A5;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
