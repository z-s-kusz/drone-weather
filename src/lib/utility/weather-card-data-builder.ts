import type { WeatherCardData } from '../types';

export function defaultWeatherCardData(title = '') {
    return {
        title,
        summary: '',
        score: 0,
        link: '',
        weather: {
            temp: 0,
            precip: 0,
            wind10m: 0,
            windGusts10m: 0,
        },
    } as WeatherCardData;
}
