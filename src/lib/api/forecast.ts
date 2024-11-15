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

export async function getSevenDaySummaryAI(location: Location): Promise<any> {
    try {
        const response = await fetch(`/ai-forecast?lat=${location.lat}&long=${location.long}`);
        const summary = await response.json(); // type after testing
        console.log(summary)
        return summary;
    } catch (error) {
        console.error(error);
        return '';
    }
}
