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
      <div className=" root bg-fixed h-screen w-screen overflow-auto ">
        {" "}
        <h1 className="text-4xl font-semibold text-center pt-10 ">
          Weather app
        </h1>
        <div className="flex justify-center items-center ">
          <input
            type="text"
            value={cityName}
            placeholder="Enter city name"
            className="rounded-full w-4/6 md:w-1/6 h-12 border-slate-950 mt-6 p-4"
            onChange={(e) => {
              setCityName(e.target.value);
            }}
          ></input>
          <button onClick={handleClick}>
            {" "}
            <Search className="w-12 h-12 mt-6 bordered ml-2 rounded-md " />
          </button>
        </div>
        {wrong ? (
          <p className="text-center font-medium text-black mt-4 text-2xl">
            You have misspelled the place name please try again
          </p>
        ) : (
          <>
            <div className="w-full h-full flex-column justify-center  items-center  mt-4 drop-shadow-lg ">
              <div className="h-2/6 w-full sm:w-1/2 flex justify-center items-center mx-auto p-1">
                {weather && (
                  <Card className="  font-medium text-black backdrop-blur-sm shadow-lg border-none rounded-lg  h-5/6 w-full bg-inherit backdrop-opacity-95">
                    <CardHeader>
                      <CardTitle className="text-lg md:4xl">
                        {place?.name}, {place?.adm_area1}, {place?.country}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-2">
                      {getWeatherIcon(weather.current.icon_num) ? (
                        <p className="float-right">
                          {getWeatherIcon(weather.current.icon_num)}
                        </p>
                      ) : null}

                      <p className="text-sm font-semibold">
                        Temperature: {weather.current.temperature}°C
                      </p>
                      <p className="text-sm font-semibold">
                        Wind:{weather.current.wind.speed}
                      </p>

                      <p className="text-sm font-semibold">
                        Weather: {weather.current.summary}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
              <div className="w-full h-4/6 flex justify-center items-center m-0 drop-shadow-lg">
                <Card className="w-full h-full border-none bg-inherit  ">
                  <CardHeader className="pt-4 h-20 w-full">
                    <CardTitle className="text-center text-2xl  font-medium text-black">
                      {weather ? "7 days weather forecast" : null}
                    </CardTitle>
                  </CardHeader>

                  <div className="z-10 flex flex-wrap justify-center items-center gap-2 mt-0 ">
                    {weather?.daily.data.map((day, index) => (
                      <Card
                        key={index}
                        className=" z-10 backdrop-blur-lg  bg-white/25 border-none h-48 w-40 p-1 shadow-lg text-shadow-md rounded-lg p-2  font-bold    text-sm"
                      >
                        <CardContent className="p-1">
                          <p>{getDayName(day.day)}</p>

                          <p>Min: {day.all_day.temperature_min}°C</p>
                          <p>Max: {day.all_day.temperature_max}°C</p>
                          <p>{day.summary}</p>
                        </CardContent>
                      </Card>
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
