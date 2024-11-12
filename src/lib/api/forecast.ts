import { fetchWeatherApi } from 'openmeteo';

// 45.01356219558156, -93.16691882632526

export async function getForecast(lat: string, long: string) {
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
        const url = "https://api.open-meteo.com/v1/forecast";
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

function getSummaryForDay(lat: number, long: number, date: string) {

}
