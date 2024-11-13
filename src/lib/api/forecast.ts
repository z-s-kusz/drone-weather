import type { Location, WeatherCardData } from '$lib/types';

export async function getCurrentWeatherCard(location: Location): Promise<WeatherCardData> {
    try {
        const response = await fetch(`/forecast?type=current&lat=${location.lat}&long=${location.long}`);
        const weather: WeatherCardData = await response.json();
        return weather;
    } catch (error) {
        throw new Error('Error fetching current weather');
    }
}
