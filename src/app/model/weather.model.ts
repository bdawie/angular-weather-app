export interface CurrentWeather {
  coord: Coordinate;
  weather: Weather[];
  main: Main;
  dt_txt: string;
}

export interface DailyWeather {
  city: string;
  list: CurrentWeather[];
}

interface Coordinate {
  lat: number;
  lon: number;
}

interface Weather {
  id: string;
  main: string;
  description: string;
  icon: string;
}

interface Main {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level: number;
  grnd_level: number;
}
