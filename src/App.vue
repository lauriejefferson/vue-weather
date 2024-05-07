<script setup>
import { ref, computed, onMounted } from 'vue';
import getWeather from '@/composables/getWeather'

const city = ref("");
const cityRef = ref("");
const fetchedData = ref(false);
const forecast = ref([]);
const currentDay = ref([]);
const labels = ref({ 0: 'SU', 1: 'MO', 2: 'TU', 3: 'WED', 4: 'TH', 5: 'FR', 6: 'SA' });
const expand = ref(false);
const time = ref(0);

const { error, load } = getWeather()
const daysOfTheWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const handleSubmit = async () => {
  fetchedData.value = true
  const res = await load(city.value)
  cityRef.value = res.city.name;
  const weather = computed(() => res.list.filter(item => item.dt_txt.substring(11) === '12:00:00'))
  console.log(weather.value)
  forecast.value = computed(() => weather.value.map(
    (item) => ({
      day: daysOfTheWeek[new Date(item.dt_txt.substring(0, 10)).getDay()],
      temp: Math.round(item.main.temp),
      high: Math.round(item.main.temp_max),
      low: Math.round(item.main.temp_min),
      precipitation: item.rain,
      windspeed: Math.round(item.wind.speed),
      description: item.weather[0].description,
      icon: item.weather[0].icon
    })
  ))
  currentDay.value = computed(() => forecast.value.value[0])
  console.log(currentDay.value.value)

};



</script>

<template>
  <form @submit.prevent="handleSubmit" class="form">
    <input type="text" placeholder="Enter a city " v-model="city">
    <button class="btn">Search</button>
  </form>
  <v-card class="mx-auto mt-3" max-width="400" v-if="fetchedData">
    <v-card-item :title="cityRef">
      <template v-slot:subtitle v-if="currentDay.value">
        {{ currentDay.value.description }}
        <v-img :src="`https://openweathermap.org/img/wn/${currentDay.value.icon}@2x.png`" :width="100"></v-img>
      </template>
    </v-card-item>
    <v-card-text class="py-0" v-if="currentDay.value">
      <v-row align="center" no-gutters>
        <v-col class="text-h2" cols="6">
          {{ currentDay.value.temp }}&deg;F
        </v-col>
      </v-row>
    </v-card-text>
    <div class="d-flex py-3 justify-space-between">
      <v-list-item density="compact" prepend-icon="mdi-weather-windy" v-if="currentDay.value">
        <v-list-item-subtitle>{{ currentDay.value.windspeed }} km/h Winds</v-list-item-subtitle>
      </v-list-item>

      <v-list-item density="compact" prepend-icon="mdi-weather-pouring" v-if="currentDay.value">
        <div v-if="currentDay.value.precipitation">
          <v-list-item-subtitle>{{ currentDay.value.precipitation }}% Precipitation</v-list-item-subtitle>
        </div>
        <div v-else>
          <v-list-item-subtitle>0% Precipitation</v-list-item-subtitle>
        </div>

      </v-list-item>
    </div>
    <v-expand-transition>
      <div v-if="expand">
        <div class="py-2">
          <v-slider v-model="time" :max="6" :step="1" :ticks="labels" class="mx-4" color="primary" density="compact"
            show-ticks="always" thumb-size="10" hide-details></v-slider>
        </div>

        <v-list class="bg-transparent">
          <v-list-item v-for="item in forecast.value" :key="item.day" :append-icon="item.icon" :subtitle="item.temp"
            :title="item.day">
          </v-list-item>
        </v-list>
      </div>
    </v-expand-transition>

    <v-divider></v-divider>

    <v-card-actions>
      <v-btn :text="!expand ? 'Full Report' : 'Hide Report'" @click="expand = !expand"></v-btn>
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
