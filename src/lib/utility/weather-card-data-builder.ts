import type { WeatherCardData } from '../types';

export function defaultWeatherCardData(title = '') {
    return {
        title,
        summary: '',
        score: 0,
        link: '',
        weather: {
            temperature: 0,
            precipitation: 0,
            wind: 0,
            gusts: 0,
        },
    } as WeatherCardData;
}
