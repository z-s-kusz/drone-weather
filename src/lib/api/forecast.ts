import type { Location, WeatherCardData } from '$lib/types';

type ForecastType = 'current' | 'sevenDay';

// should split current/sevenday to have consistent returns but i dont care :)
export async function getWeather(location: Location, type: ForecastType): Promise<WeatherCardData | string> {
    try {
        let weather: WeatherCardData | string;
        const response = await fetch(`/forecast?type=${type}&lat=${location.lat}&long=${location.long}`);

        if (response.status === 500) {
            throw new Error('Api error fetching weather. Status ' + response.status);
        }

        if (type === 'current') {
            weather = await response.json() as WeatherCardData;
        } else if (type === 'sevenDay') {
            weather = await response.json() as string;
        } else {
            throw new Error('unsupported type ' + type);
        }
        return weather;
    } catch (err: any) {
        throw new Error(err?.message || 'Error getting weather data.');
    }
}

export async function getSevenDaySummaryAI(location: Location): Promise<string> {
    try {
        const response = await fetch(`/ai-forecast?lat=${location.lat}&long=${location.long}`);
        let summary: any = await response.json();
        if (summary.message) summary = summary.message;
        return summary;
    } catch (error) {
        throw new Error('Error getting AI seven day summary reponse.');
    }
}
