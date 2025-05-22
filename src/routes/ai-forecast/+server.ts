import { OPENAI_API_KEY } from '$env/static/private';
import { getSevenDayWeatherData } from '$lib/server/get-open-meteo-data.js';
import { filterBadWeather, splitIntoDays } from '$lib/utility/generate-summaries';
import { bestWindSpeedMax, worstAlllowedWindSpeedMax, worstAllowedGustsMax } from '$lib/utility/ideal-weather-settings.js';
import { error, json } from '@sveltejs/kit';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
});

export async function GET({ url }): Promise<any> {
    // values not garunteed but non-numbers passed to parseFloat will result in NaN
    let lat = parseFloat(url.searchParams.get('lat')!);
    let long = parseFloat(url.searchParams.get('long')!);

    if (Number.isNaN(lat) || Number.isNaN(long)) {
        return error(400, '"lat" and "long" are requred and must be numbers.');
    }

    try {
        const weather = await getSevenDayWeatherData(lat, long);
        const filteredWeatherByDays = splitIntoDays(filterBadWeather(weather));
        const forecast = await getAIForecast(filteredWeatherByDays);
        return json(forecast);
    } catch (err) {
        console.error(err);
        return error(500, 'Error getting ai forecast.');
    }
}

async function getAIForecast(weather: any): Promise<string> {
    try {
        const completion = await openai.chat.completions.create({
            messages: [
                { role: 'system', content: systemMessage },
                {
                    role: 'user',
                    content: `Weather JSON: ${JSON.stringify(weather)}.`,
                },
            ],
            model: 'gpt-4o-mini',
        });

        const summary = completion.choices[0].message.content!;
        return summary;
    } catch (error) {
        console.error(error);
        throw new Error('getAIForecast error.');
    }
}

const systemMessage = `
Prompt:
You're a weather forecaster helping hobbyists find optimal times to fly tiny drones.
These drones are very sensitive to weather conditions.
Your task is to identify one to three of the best days and times for flying within the forecast provided as hourly JSON data.

Criteria:
- Wind speeds must be below ${worstAlllowedWindSpeedMax} mph. Ideal wind speeds are at or below ${bestWindSpeedMax} mph.
- Gusts must be below ${worstAllowedGustsMax} mph. The lower the better.

Output:
- Identify 1 to 3 days and times that best match the criteria.
- Provide concise recommendations, formatted as a message (no markdown).
- List times in a 12-hour format.
- Don't mention temperature, it's assumed any day mentioned is warm enough.
- Don't mention rain, it's assumed any day mentioned has a low/no chance of rain.
- If JSON data is empty, respond "No ideal flying days are forecasted."

2 Example Responses:
- "Wednesday at 1:00 and Sunday at 4:00 look to be great flying times with light winds and below-average gusts."
- "No ideal flying days are forecasted."`;
