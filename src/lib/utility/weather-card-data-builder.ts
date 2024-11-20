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
            wind: 0,
            windGusts: 0,
        },
    } as WeatherCardData;
}
