import { json, error } from '@sveltejs/kit';
import { fetchWeatherApi } from 'openmeteo';
import type { WeatherCardData } from '$lib/types';

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

async function getForecast(lat: string, long: string) {
    try {
        const params = {
            "latitude": lat,
            "longitude": long,
            "hourly": ["temperature_2m", "precipitation", "wind_speed_10m", "wind_speed_80m", "wind_direction_10m", "wind_direction_80m", "wind_gusts_10m", "temperature_80m"],
            "temperature_unit": "fahrenheit",
            "wind_speed_unit": "mph",
            "precipitation_unit": "inch",
            "timezone": "America/Chicago",
            "forecast_days": 1
        };
        const responses = await fetchWeatherApi(url, params);
        const response = responses[0];
        return processResponse(response);
    } catch (error) {
        console.error('getForecast err', error);
        throw new Error(`Error getting forecast for ${lat}, ${long}`);
    }
}

function processResponse(response: any) {
    // Attributes for timezone and location
    const utcOffsetSeconds = response.utcOffsetSeconds();
    const timezone = response.timezone();
    const hourly = response.hourly()!;

    const weatherData = {
        hourly: {
            time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
                (t) => new Date((t + utcOffsetSeconds) * 1000)
            ),
            temperature2m: hourly.variables(0)!.valuesArray()!,
            precipitation: hourly.variables(1)!.valuesArray()!,
            windSpeed10m: hourly.variables(2)!.valuesArray()!,
            windSpeed80m: hourly.variables(3)!.valuesArray()!,
            windDirection10m: hourly.variables(4)!.valuesArray()!,
            windDirection80m: hourly.variables(5)!.valuesArray()!,
            windGusts10m: hourly.variables(6)!.valuesArray()!,
            temperature80m: hourly.variables(7)!.valuesArray()!,
        },
    };
    return weatherData;
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
		windGusts10m: current.variables(4)!.value(), // use this too!
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

// let summary = 'Perfect weather for even the itty-bittiest little drone to fly outside!';
// let score = 5;
function generateSnapshotSummary(weather: any): { summary: string, score: number} {
    let summary = '';
    let score = 0;

    if (weather.temperature2m <= 40) {
        summary = 'Too cold to fly tiny drones outside.';
        score = 0;
        return { summary, score };
    }
    if (weather.precipitation >= 66) {
        summary = 'Too wet to fly.';
        score = 0;
        return { summary, score };
    }
    if (weather.wind10m >= 20) {
        summary = 'Too windy to fly tiny drones outside.'
        score = 0;
        return { summary, score };
    }

    // TODO account for gusts
    if (weather.wind10m >= 14) {
        summary += 'Quite breezy. ';
        score += 1;
    } else if (weather.wind10m >= 9) {
        summary += 'Breezy. '
        score += 2;
    } else if (weather.wind10m >=4) {
        score+= 3;
    } else {
        summary+= 'Very low wind. '
        score += 4;
    }

    if (weather.windGusts10m <= 10) {
        summary += 'Super light gusts. ';
        score += 1;
    }

    if (weather.precipitation >= 33) {
        summary += 'Chance of precipitation. ';
    }
    return { summary, score };
}

function generateTimeSpanSummary(weather: any): string {
    let summary = '';
    return summary;
}
