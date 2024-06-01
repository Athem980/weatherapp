"use client";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import "./page.css";
import { WiDaySunny, WiCloudy, WiRain, WiSnow } from "react-icons/wi";

interface Wind {
  speed: number;
  angle: number;
  dir: string;
}

interface Precipitation {
  total: number;
  type: string;
}

interface CloudCover {
  total: number;
}

interface CurrentWeather {
  icon: string;
  icon_num: number;
  summary: string;
  temperature: number;
  wind: Wind;
  precipitation: Precipitation;
  cloud_cover: number;
}

interface AllDay {
  weather: string;
  icon: number;
  temperature: number;
  temperature_min: number;
  temperature_max: number;
  wind: Wind;
  cloud_cover: CloudCover;
  precipitation: Precipitation;
}

interface DailyForecast {
  day: string;
  weather: string;
  icon: number;
  summary: string;
  all_day: AllDay;
}

interface WeatherData {
  lat: string;
  lon: string;
  elevation: number;
  timezone: string;
  units: string;
  current: CurrentWeather;
  daily: {
    data: DailyForecast[];
  };
}
interface placedata {
  name: string;
  adm_area1: string;
  country: string;
}
export default function Home() {
  const [cityName, setCityName] = useState<string>("");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [latitude, setLatitude] = useState<string | null>(null);
  const [longitude, setLongitude] = useState<string | null>(null);
  const [place, setPlace] = useState<placedata | null>(null);
  const [wrong, setError] = useState<boolean | null>(false);
  // fetching the api which gives the weather
  async function handleClick() {
    const url = `https://www.meteosource.com/api/v1/free/point?place_id=${cityName}&sections=current,daily&language=en&units=auto&key=hyyifpsid6wvoy7sv9wg0l5ge3rt9enxiqe7glb3`;
    const options = {
      method: "GET",
      CORS: "no-cors",
    };
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(
          "Failed to fetch weather data. Please check the city name."
        );
      }
      const result = await response.json();
      setWeather(result);
      setLatitude(result.lat);
      setLongitude(result.lon);
      setError(null);
      console.log(result);
    } catch (error: any) {
      setError(error.message);
      setWeather(null);
      setLatitude(null);
      setLongitude(null);
      setPlace(null);
    }
  }
  //fetching the api which gives the place id in which i have to give latitude and longitude
  useEffect(() => {
    if (latitude && longitude) {
      const fetchPlaceData = async () => {
        const url = `https://www.meteosource.com/api/v1/free/nearest_place?lat=${latitude}&lon=${longitude}&language=en&key=hyyifpsid6wvoy7sv9wg0l5ge3rt9enxiqe7glb3`;
        const options = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        };
        // error handling
        try {
          const response = await fetch(url, options);
          if (!response.ok) {
            throw new Error("Failed to fetch place data.");
          }
          const result = await response.json();
          setPlace(result);
          console.log(result);
        } catch (error: any) {
          setError(error.message);
          setPlace(null);
        }
      };

      fetchPlaceData();
    }
  }, [latitude, longitude]);
  // function that gets the respective days actually this api gives only dates
  function getDayName(dateString: string): string {
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const date = new Date(dateString);
    return days[date.getDay()];
  }
  function getWeatherIcon(iconCode: number): JSX.Element {
    switch (iconCode) {
      case 1:
        return <WiRain size={64} />;
      case 2:
        return <WiCloudy size={64} />;
      case 3:
        return <WiDaySunny size={64} />;
      case 4:
        return <WiDaySunny size={64} />;
      case 5:
        return <WiCloudy size={64} />;
      case 6:
        return <WiSnow size={64} />;
      case 7:
        return <WiCloudy size={64} />;
      default:
        return <WiDaySunny size={64} />;
    }
  }

  return (
    <>
      <div className=" root h-screen w-screen bg">
        {" "}
        <h1 className="text-4xl font-semibold text-center mt-4 ">
          Weather app
        </h1>
        <div className="flex justify-center items-center ">
          <input
            type="text"
            value={cityName}
            placeholder="Enter city name"
            className="rounded-full w-2/6 h-12 border-slate-950 mt-6 p-4"
            onChange={(e) => {
              setCityName(e.target.value);
            }}
          ></input>
          <button onClick={handleClick}>
            {" "}
            <Search className="w-12 h-12 mt-6 border-gray-300 ml-2 rounded-md " />
          </button>
        </div>
        {wrong ? (
          <p className="text-center font-medium text-slate-100 mt-4 text-2xl">
            You have misspelled the place name please try again
          </p>
        ) : (
          <>
            <div className="w-full h-full flex-column justify-center  items-center  mt-4 drop-shadow-lg ">
              <div className="h-1/4 w-1/2 flex justify-center items-center mx-auto ">
                {weather && (
                  <Card className="font-medium text-slate-100 backdrop-blur-sm shadow-lg border-blue-950 rounded-lg border-none h-full w-full bg-inherit backdrop-opacity-95">
                    <CardHeader>
                      <CardTitle>
                        {place?.name}, {place?.adm_area1}, {place?.country}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {getWeatherIcon(weather.current.icon_num) ? (
                        <p className="float-right">
                          {getWeatherIcon(weather.current.icon_num)}
                        </p>
                      ) : null}

                      <p>Temperature: {weather.current.temperature}°C</p>
                      <p>Wind:{weather.current.wind.speed}</p>

                      <p>Weather: {weather.current.summary}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
              <div className="w-full h-4/6 flex justify-center items-center m-0 drop-shadow-lg">
                <Card className="w-full h-full border-none bg-inherit ">
                  <CardHeader>
                    <CardTitle className="text-center text-4xl font-medium text-slate-100">
                      {weather ? "7 days weather forecast" : null}
                    </CardTitle>
                  </CardHeader>

                  <div className="flex flex-wrap justify-center items-center gap-2 mt-0 drop-shadow-lg">
                    {weather?.daily.data.map((day, index) => (
                      <div
                        key={index}
                        className="h-48 w-48 shadow-lg border-blue-950 rounded-lg p-2 font-medium text-slate-100 backdrop-opacity-95 backdrop-blur-sm text-sm"
                      >
                        <CardContent>
                          <p>{getDayName(day.day)}</p>

                          <p>Min: {day.all_day.temperature_min}°C</p>
                          <p>Max: {day.all_day.temperature_max}°C</p>
                          <p>{day.summary}</p>
                        </CardContent>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
