import { Component, OnInit, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';
import { WeatherService } from './weather.service';

import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  forkJoin,
  map,
  of,
  retry,
  retryWhen,
  switchMap,
  takeWhile,
  tap,
  throwError,
} from 'rxjs';
import { CurrentWeather, DailyWeather } from './model/weather.model';
import { environment } from 'src/environments/environment.development';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'weather-app';

  cityControl = new FormControl();

  cityCurrentWeather: CurrentWeather | undefined;
  cityDailyWeather: DailyWeather | undefined;
  parsedDailyWeather: CurrentWeather[][] = [];
  isSearching = false;

  constructor(
    private wService: WeatherService,
    private domSanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.cityControl.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        tap((_) => (this.isSearching = true)),
        switchMap((city: any) => {
          if (city === '') {
            return of([undefined, undefined]);
          } else {
            return forkJoin([
              this.wService.getCurrentWeather(city),
              this.wService.getDailyWeather(city),
            ]).pipe(
              catchError((e) => {
                if (e instanceof HttpErrorResponse) {
                  console.log(e.message);
                  console.log(e.status);
                  return of([undefined, undefined]);
                } else {
                  return of([undefined, undefined]);
                }
              }),
              retry()
            );
          }
        })
      )
      .subscribe(
        (res) => {
          this.isSearching = false;
          console.log(res);
          this.cityCurrentWeather = res[0];
          this.cityDailyWeather = res[1];
          this.parsedDailyWeather = this.praseDailyList();
        },
        (err) => console.log(err)
      );
  }

  get city() {
    return this.cityControl.value;
  }

  getCurrentWeatherTemp(city: CurrentWeather) {
    return Math.round(city.main.temp - 273.15);
  }

  getAverageWeatherTemp(city: CurrentWeather[]) {
    let tempSum = 0;
    city.forEach((c) => {
      tempSum += c.main.temp - 273.15;
    });

    return tempSum / city.length;
  }

  getCurrentWeatherIcon(city: CurrentWeather) {
    return this.domSanitizer.bypassSecurityTrustResourceUrl(
      environment.API_CURRENT_WEATHER_URL +
        '/' +
        city.weather[0].icon +
        '@2x.png'
    );
  }

  private praseDailyList() {
    if (this.cityDailyWeather) {
      const filterdList = this.cityDailyWeather.list.filter(
        (l) => new Date(l.dt_txt).getDate() !== new Date().getDate()
      );

      const parsedList = [];
      parsedList.push(filterdList.slice(0, 8));
      parsedList.push(filterdList.slice(8, 16));
      parsedList.push(filterdList.slice(16, 24));
      parsedList.push(filterdList.slice(24, 32));
      parsedList.push(filterdList.slice(32));

      return parsedList;
    } else {
      return [];
    }
  }
}
