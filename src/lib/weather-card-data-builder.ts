import type { WeatherCardData } from './types';

export function defaultWeatherCardData(title = '') {
    return {
        title,
        summary: '',
        link: '',
        weather: {
            temp: 0,
            precip: 0,
            wind10m: 0,
            wind80m: 0,
        },
    } as WeatherCardData;
}
