import type { OpenMeteoTimeSpanData } from '$lib/types';
import { isFutureTime } from '$lib/utility/dates';
import { fetchWeatherApi } from 'openmeteo';

const url = 'https://api.open-meteo.com/v1/forecast';

export async function getSevenDayWeatherData(lat: number, long: number): Promise<OpenMeteoTimeSpanData> {
    const params = {
        'latitude': lat,
        'longitude': long,
        'hourly': ['temperature_2m', 'precipitation_probability', 'wind_speed_10m', 'wind_gusts_10m', 'is_day'],
        'temperature_unit': 'fahrenheit',
        'wind_speed_unit': 'mph',
        'precipitation_unit': 'inch',
        'timeformat': 'unixtime',
        'timezone': 'America/Chicago'
    };
    const responses = await fetchWeatherApi(url, params);
    const response = responses[0];
    const utcOffsetSeconds = response.utcOffsetSeconds();
    const hourly = response.hourly()!;

    // Note: The order of weather variables in the URL query and the indices below need to match!
    const weather = {
        time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
            (t) => new Date((t + utcOffsetSeconds) * 1000)
        ),
        temperature: roundArray(hourly.variables(0)!.valuesArray()!),
        precipitation: roundArray(hourly.variables(1)!.valuesArray()!),
        wind: roundArray(hourly.variables(2)!.valuesArray()!),
        gusts: roundArray(hourly.variables(3)!.valuesArray()!),
        isDay: hourly.variables(4)!.valuesArray()!,
    };

    const dayTimeWeather = removeNightAndPastForecasts(weather);
    return dayTimeWeather;
}

export async function getCurrentWeatherData(lat: number, long: number): Promise<any> {
    const params = {
        'latitude': lat,
        'longitude': long,
        'current': ['temperature_2m', 'precipitation_probability', 'wind_speed_10m', 'wind_gusts_10m'],
        'temperature_unit': 'fahrenheit',
        'wind_speed_unit': 'mph',
        'precipitation_unit': 'inch',
        'timezone': 'America/Chicago',
        'forecast_days': 1
    };
    const responses = await fetchWeatherApi(url, params);
    const current = responses[0].current()!;

    // Note: The order of weather variables in the URL query and the indices below need to match!
    return {
		temperature: round(current.variables(0)!.value()),
		precipitation: round(current.variables(1)!.value()),
		wind: round(current.variables(2)!.value()),
		gusts: round(current.variables(3)!.value()),
    };
}

// Helper function to form time ranges
const range = (start: number, stop: number, step: number) => {
    return Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);
};

const round = (num: number) => {
    return Math.round(num)
};

const roundArray = (data: Float32Array): number[] => {
    let roundedNums: number[] = [];
    data.forEach((num) => roundedNums.push(Math.round(num)));
    return roundedNums;
};

const removeNightAndPastForecasts = (weather: any): OpenMeteoTimeSpanData => {
    const isDayArray: (1 | 0)[] = [...weather.isDay];
    const times = weather.time;
    const now = new Date();

    Object.keys(weather).forEach((key) => {
        if (key === 'isDay') return;

        weather[key] = weather[key].filter((_data: any, i: number) => {
            const time = new Date(times[i]);
            return isDayArray[i] === 1 && isFutureTime(now, time);
        });
    });
    delete weather.isDay;

    return weather;
};
