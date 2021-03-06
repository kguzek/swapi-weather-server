import express, { Request, Response } from "express";
import { Weather } from "../sequelize";
import fetch from "node-fetch";
import cron from "node-cron";

const router = express.Router();

const API_URL_BASE = "https://api.openweathermap.org/data/2.5/weather";

const GLIWICE_COORDINATES = [50.294, 18.6656];

/** Converts the raw data obtained from the OpenWeatherMap API into an object
 *  of the same format as the Sequelize model used to represent the data in the database.
 */
const serialiseResponseFromAPI = (
  data: any,
  weatherInfo: { main?: string; description?: string; icon?: string }
) => ({
  longitude: data?.coord?.lon,
  latitude: data?.coord?.lat,
  weather_info: weatherInfo?.main,
  weather_description: weatherInfo?.description,
  weather_icon: weatherInfo?.icon,
  ...(data?.main ?? {}),
  visibility: data?.visibility,
  wind_speed: data?.wind?.speed,
  wind_direction: data?.wind?.deg,
  wind_gust: data?.wind?.gust,
  clouds_all: data?.clouds?.all,
  data_calculation_time: new Date((data?.dt ?? 0) * 1000), // Seconds -> milliseconds
  country: data?.sys?.country,
  sunrise: new Date((data?.sys?.sunrise ?? 0) * 1000),
  sunset: new Date((data?.sys?.sunset ?? 0) * 1000),
  timezone: data?.timezone,
  city_id: data?.id,
  city_name: data?.name,
});

/** Interpolates the coordinates and API key in order to obtain the full API URL to be queried. */
const getURL = (appID: string, coordinates: number[]) => {
  const [latitude, longitude] = coordinates;
  return `${API_URL_BASE}?lat=${latitude}&lon=${longitude}&appid=${appID}`;
};

/** Retrieves the weather data from the API and stores it in the database. */
async function fetchWeather(reject: Function) {
  const API_KEY = process.env.WEATHER_API_KEY;
  if (!API_KEY) {
    return void reject("No weather API key.");
  }
  const WEATHER_API_URL = getURL(API_KEY, GLIWICE_COORDINATES);
  let response;
  try {
    response = await fetch(WEATHER_API_URL);
  } catch (err) {
    const errMsg = (err as Error).message;
    return void reject("Could not fetch weather from API: " + errMsg);
  }
  const rawData = await response.json();
  const weatherInfo = rawData?.weather?.shift();
  const data = serialiseResponseFromAPI(rawData, weatherInfo);
  return await Weather.create(data);
}

router.get("/get", async (_req: Request, res: Response) => {
  // Sort by ID in descending order to get the most recent db entry
  const weatherData = await Weather.findOne({ order: [["id", "DESC"]] });
  res.status(200).json(weatherData ?? { error: "No weather data yet." });
});

// Register CRON job for the first minute of every hour
cron.schedule("0 * * * *", async () => {
  await fetchWeather(console.error);
  console.info("Successfully fetched weather data.");
});

export default router;
