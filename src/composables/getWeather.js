import { ref } from 'vue';

const getWeather = () => {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  const error = ref(null);

  const load = async (city) => {
    try {
      let geoJSON = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
      );
      let geoData = await geoJSON.json();
      let lat = geoData[0].lat;
      let lon = geoData[0].lon;
      let response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`
      );
      const data = await response.json();
      return data;
    } catch (err) {
      error.value = err.message;
      console.log(error.value);
    }
  };

  return { error, load };
};

export default getWeather;
