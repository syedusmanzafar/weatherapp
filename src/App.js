import { useState } from "react";
import Search from "./components/search";
import CurrentWeather from "./components/current-weather";
import Forecast from "./components/forecast";
import { WEATHER_API_URL, WEATHER_API_KEY } from "./state";
import "./App.css";
import {db} from "./firebase";
 


function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const[weather, setWeather]=useState("");
  const[Humidity, setHumidity]=useState("");

  const handleOnSearchChange = (searchData) => {
    const [lat, lon] = searchData.value.split(" ");

    const currentWeatherFetch = fetch(
      `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );
    const forecastFetch = fetch(
      `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );

    Promise.all([currentWeatherFetch, forecastFetch])
      .then(async (response) => {
        const weatherResponse = await response[0].json();
        const forcastResponse = await response[1].json();

        setCurrentWeather({ city: searchData.label, ...weatherResponse });
        setForecast({ city: searchData.label, ...forcastResponse });
      })
      .catch(console.log);
      db.collection('Cities').add({
        weather:currentWeather,
        Humidity:forecast
      })
      .then(() => 
      { 
      alert("Data has beeen submitted");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <div className="container">
      <Search onSearchChange={handleOnSearchChange} />
      {currentWeather && <CurrentWeather data={currentWeather} />}
      {forecast && <Forecast data={forecast} />}
    </div>
  );
  
}

export default App;