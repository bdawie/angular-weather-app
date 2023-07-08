import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment.development';

import { CurrentWeather, DailyWeather } from './model/weather.model';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  constructor(private http: HttpClient) {}

  //   getLatLonFromCityName(cityName: string) {
  //     return this.http.get(environment.API_GEO_URL, {
  //       params: {
  //         q: cityName,
  //         appid: environment.API_KEY,
  //       },
  //     });
  //   }

  getCurrentWeather(city: string) {
    return this.http.get<CurrentWeather>(environment.API_WEATHER_URL, {
      params: {
        q: city,
        appid: environment.API_KEY,
      },
    });
  }

  getDailyWeather(city: string) {
    return this.http.get<DailyWeather>(environment.API_DAILY_WEATHER_URL, {
      params: {
        q: city,
        // cnt: 3,
        appid: environment.API_KEY,
      },
    });
  }
}
