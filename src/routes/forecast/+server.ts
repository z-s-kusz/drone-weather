import { json, error } from '@sveltejs/kit';
import { fetchWeatherApi } from 'openmeteo';
import type { TimeSpanSumamryCard, WeatherCardData } from '$lib/types';
import { generateSnapshotSummary, generateTimeSpanSummary } from '$lib/generate-summaries';

const url = "https://api.open-meteo.com/v1/forecast";

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
    const weather = {};
    const snapshots = generateTimeSpanSummary(weather)

    const timeSpanSummary: TimeSpanSumamryCard = {
        title: 'Current',
        summary: '', // generate from snapshots data
        link: '/daily/',
        snapshots,
    };

    return timeSpanSummary;
}

// Helper function to form time ranges
const range = (start: number, stop: number, step: number) => {
    return Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);
}

async function getCurrentSummary(lat: number, long: number): Promise<WeatherCardData> {
    const params = {
        "latitude": lat,
        "longitude": long,
        "current": ["temperature_2m", "precipitation", "wind_speed_10m", "wind_direction_10m", "wind_gusts_10m"],
        "temperature_unit": "fahrenheit",
        "wind_speed_unit": "mph",
        "precipitation_unit": "inch",
        "timezone": "America/Chicago",
        "forecast_days": 1
    };
    const responses = await fetchWeatherApi(url, params);
    const current = responses[0].current()!;

    // Note: The order of weather variables in the URL query and the indices below need to match!
    const weatherData = {
		temperature2m: current.variables(0)!.value(),
		precipitation: current.variables(1)!.value(),
		windSpeed10m: current.variables(2)!.value(),
		windDirection10m: current.variables(3)!.value(),
		windGusts10m: current.variables(4)!.value(),
    };

    const { summary, score } = generateSnapshotSummary(weatherData);

    const weatherCardData: WeatherCardData = {
        title: 'Current',
        summary,
        score,
        link: '',
        weather: {
            wind10m: +weatherData.windSpeed10m.toFixed(2),
            windGusts10m: +weatherData.windGusts10m.toFixed(2),
            temp: +weatherData.temperature2m.toFixed(2),
            precip: +weatherData.precipitation.toFixed(2),
        }
    };

    return weatherCardData;
}
