import { fetchWeatherApi } from 'openmeteo';

const url = 'https://api.open-meteo.com/v1/forecast';

export async function getSevenDayWeatherData(lat: number, long: number): Promise<any> {
    const params = {
        'latitude': lat,
        'longitude': long,
        'hourly': ['temperature_2m', 'precipitation', 'wind_speed_10m', 'wind_gusts_10m', 'is_day'],
        'temperature_unit': 'fahrenheit',
        'wind_speed_unit': 'mph',
        'precipitation_unit': 'inch',
        'timeformat': 'unixtime',
        'timezone': 'America/Chicago'
    };
    const responses = await fetchWeatherApi(url, params);
    const response = responses[0];
    const utcOffsetSeconds = response.utcOffsetSeconds();
    const hourly = response.hourly()!;

    // Note: The order of weather variables in the URL query and the indices below need to match!
    const weather = {
        time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
            (t) => new Date((t + utcOffsetSeconds) * 1000)
        ),
        temperature: round(hourly.variables(0)!.valuesArray()!),
        precipitation: round(hourly.variables(1)!.valuesArray()!),
        windSpeed: round(hourly.variables(2)!.valuesArray()!),
        windGusts: round(hourly.variables(3)!.valuesArray()!),
        isDay: hourly.variables(4)!.valuesArray()!,
    };

    const daylightOnlyData = filterOutNights(weather);
}

export async function getCurrentWeatherData(lat: number, long: number): Promise<any> {
    const params = {
        'latitude': lat,
        'longitude': long,
        'current': ['temperature_2m', 'precipitation', 'wind_speed_10m', 'wind_direction_10m', 'wind_gusts_10m'],
        'temperature_unit': 'fahrenheit',
        'wind_speed_unit': 'mph',
        'precipitation_unit': 'inch',
        'timezone': 'America/Chicago',
        'forecast_days': 1
    };
    const responses = await fetchWeatherApi(url, params);
    const current = responses[0].current()!;

    // Note: The order of weather variables in the URL query and the indices below need to match!
    return {
		temperature2m: current.variables(0)!.value(),
		precipitation: current.variables(1)!.value(),
		windSpeed10m: current.variables(2)!.value(),
		windDirection10m: current.variables(3)!.value(),
		windGusts10m: current.variables(4)!.value(),
    };
}

// Helper function to form time ranges
const range = (start: number, stop: number, step: number) => {
    return Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);
};

const round = (data: Float32Array): number[] => {
    console.log('round called');
    // @ts-ignore hmmm.....
    return data.map((num) => {
        return Math.round(num * 100) / 100;
    });
};

const filterOutNights = (weather: any): any => {
    const isDayArray: (1 | 0)[] = weather.isDay;

    Object.entries(weather).forEach(([key, value]) => {
        // need way to filter from matching index
    });
};
