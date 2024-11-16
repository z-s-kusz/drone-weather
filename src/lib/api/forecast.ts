import type { Location, WeatherCardData } from '$lib/types';

export async function getCurrentWeather(location: Location): Promise<WeatherCardData> {
    try {
        const response = await fetch(`/forecast?type=current&lat=${location.lat}&long=${location.long}`);
        const weather: WeatherCardData = await response.json();
        return weather;
    } catch (error) {
        throw new Error('Error fetching current weather');
    }
}

export async function getSevenDaySummaryAI(location: Location): Promise<string> {
    try {
        const response = await fetch(`/ai-forecast?lat=${location.lat}&long=${location.long}`);
        const summary: string = await response.json();
        return summary;
    } catch (error) {
        throw new Error('Error getting AI seven day summary reponse.');
    }
}
