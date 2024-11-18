import { json, error } from '@sveltejs/kit';
import type { TimeSpanSumamryCard, WeatherCardData } from '$lib/types';
import { generateSnapshotSummary, generateTimeSpanSummary } from '$lib/utility/generate-summaries';
import { getCurrentWeatherData, getSevenDayWeatherData } from '$lib/server/get-open-meteo-data';

export async function GET({ url }) {
    const forecastType = url.searchParams.get('type');
    // values not garunteed but non-numbers passed to parseFloat will result in NaN
    let lat = parseFloat(url.searchParams.get('lat')!);
    let long = parseFloat(url.searchParams.get('long')!);

    if (Number.isNaN(lat) || Number.isNaN(long)) {
        return error(400, '"lat" and "long" are requred and must be numbers.');
    } else if (!forecastType) {
        return error(400, 'Requered query param "type" not specified.');
    }

    switch(forecastType) {
        case 'current':
            const forecast = await getCurrentSummary(lat, long);
            return json(forecast);
        case 'today':
            return json('Feature coming soon');
        case 'sevenDay':
            return json('Feature coming soon');
        default:
            return error(400, 'Forecast type not supported');
    }
}

async function getSevenDaySummary(lat: number, long: number): Promise<TimeSpanSumamryCard> {
    const weather = getSevenDayWeatherData(lat, long);
    const snapshots = generateTimeSpanSummary(weather)

    const timeSpanSummary: TimeSpanSumamryCard = {
        title: 'Current',
        summary: '', // generate from snapshots data
        link: '/daily/',
        snapshots,
    };

    return timeSpanSummary;
}

async function getCurrentSummary(lat: number, long: number): Promise<WeatherCardData> {
    const weatherData = await getCurrentWeatherData(lat, long);
    const weather = {
        wind: weatherData.wind,
        windGusts: weatherData.windGusts,
        temp: weatherData.temperature,
        precip: weatherData.precipitation,
    };
    console.log(weather)
    const { summary, score } = generateSnapshotSummary(weather);

    return {
        title: 'Current',
        summary,
        score,
        link: '',
        weather,
    };
}
